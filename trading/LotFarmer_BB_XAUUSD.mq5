//+------------------------------------------------------------------+
//|                                    LotFarmer_BB_XAUUSD.mq5      |
//|                          Bollinger Bands Mean Reversion Scalper  |
//|                          XAUUSD M1 - Spread 20pt + $20 comision |
//|                                                                  |
//|  Strategia: Revenire la medie dupa atingerea benzilor BB         |
//|  Protectie: Max 5% drawdown zilnic, stop complet fara grid       |
//+------------------------------------------------------------------+
#property copyright   "LotFarmer"
#property description "BB Mean Reversion Scalper XAUUSD M1"
#property version     "1.00"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>

//=== BOLLINGER BANDS ============================================
input int     InpBBPeriod      = 20;       // BB Period
input double  InpBBDev         = 2.0;      // BB Deviation
//=== RSI FILTER =================================================
input int     InpRSIPeriod     = 9;        // RSI Period
input double  InpRSI_Long      = 42;       // RSI max for BUY (sub-40 confirma oversold)
input double  InpRSI_Short     = 58;       // RSI min pentru SELL (sub-60 confirma overbought)
//=== ATR / VOLATILITY FILTER ====================================
input int     InpATRPeriod     = 14;       // ATR Period
input double  InpATR_Min       = 3.0;      // ATR minim (puncte) – piata sa fie activa
input double  InpATR_Max       = 80.0;     // ATR maxim – evita volatilitate extrema
//=== BANDA WIDTH FILTER (evita trend puternic) ==================
input double  InpBBWidth_Max   = 1.2;      // Bandwidth maxim % - deasupra = piata trendeaza
//=== TRADE SETUP ================================================
input double  InpLotSize       = 0.01;     // Marime lot
input int     InpTP_Points     = 90;       // Take Profit in puncte (net +$50 dupa costs)
input int     InpSL_Points     = 55;       // Stop Loss in puncte
input int     InpTrailStart    = 35;       // Activare trailing stop (puncte in profit)
input int     InpTrailStep     = 20;       // Pas trailing stop (puncte)
input int     InpMagic         = 20240701; // Magic Number
//=== RISK MANAGEMENT ============================================
input double  InpMaxDailyLoss  = 4.5;      // Max pierdere zilnica % din balanta initiala
input int     InpMaxTrades     = 60;       // Max tranzactii pe zi
input int     InpMaxSimultaneous = 1;      // Max pozitii deschise simultan
//=== SESSION FILTER =============================================
input bool    InpUseSession    = true;     // Filtru de sesiune activ
input int     InpSessStart     = 7;        // Ora start (server time) – London open
input int     InpSessEnd       = 20;       // Ora stop  (server time)
//=== SPREAD FILTER =============================================
input int     InpMaxSpread     = 28;       // Spread maxim admis (puncte)

//--- Globale
CTrade  g_Trade;
int     g_hBB, g_hRSI, g_hATR;

datetime g_LastBar      = 0;
datetime g_LastDay      = 0;
double   g_DayBalance   = 0;
int      g_TradesToday  = 0;
bool     g_DayStop      = false;

//+------------------------------------------------------------------+
int OnInit()
{
    if(_Symbol != "XAUUSD") {
        Alert("EA proiectat pentru XAUUSD. Symbol curent: ", _Symbol);
        return INIT_FAILED;
    }
    if(Period() != PERIOD_M1) {
        Alert("EA proiectat pentru M1. Timeframe curent: ", EnumToString(Period()));
        return INIT_FAILED;
    }

    g_hBB  = iBands(_Symbol, PERIOD_M1, InpBBPeriod, 0, InpBBDev, PRICE_CLOSE);
    g_hRSI = iRSI(_Symbol, PERIOD_M1, InpRSIPeriod, PRICE_CLOSE);
    g_hATR = iATR(_Symbol, PERIOD_M1, InpATRPeriod);

    if(g_hBB == INVALID_HANDLE || g_hRSI == INVALID_HANDLE || g_hATR == INVALID_HANDLE) {
        Print("Eroare la crearea indicatorilor.");
        return INIT_FAILED;
    }

    g_Trade.SetExpertMagicNumber(InpMagic);
    g_Trade.SetDeviationInPoints(25);
    g_Trade.SetTypeFilling(ORDER_FILLING_FOK);

    g_DayBalance  = AccountInfoDouble(ACCOUNT_BALANCE);
    g_TradesToday = 0;
    g_DayStop     = false;
    g_LastDay     = 0;

    Print("=== LotFarmer BB XAUUSD M1 pornit ===");
    Print("Balanta initiala: ", g_DayBalance);
    PrintCostAnalysis();

    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    if(g_hBB  != INVALID_HANDLE) IndicatorRelease(g_hBB);
    if(g_hRSI != INVALID_HANDLE) IndicatorRelease(g_hRSI);
    if(g_hATR != INVALID_HANDLE) IndicatorRelease(g_hATR);
}

//+------------------------------------------------------------------+
void OnTick()
{
    // Trailing stop se executa pe fiecare tick
    if(CountPositions() > 0)
        ManageTrailingStop();

    // Logica principala doar pe bara noua
    datetime curBar = iTime(_Symbol, PERIOD_M1, 0);
    if(curBar == g_LastBar) return;
    g_LastBar = curBar;

    CheckNewDay();

    // Garda de siguranta
    if(g_DayStop)                              return;
    if(g_TradesToday >= InpMaxTrades)          return;
    if(InpUseSession && !IsSessionOpen())      return;
    if(SpreadTooHigh())                        return;
    if(CountPositions() >= InpMaxSimultaneous) return;

    // Obtine valori indicatori (bara inchisa = index 1)
    double bbUpper[1], bbLower[1], bbMid[1];
    double rsi[1], atr[1];

    if(CopyBuffer(g_hBB,  1, 1, 1, bbUpper) < 1) return;
    if(CopyBuffer(g_hBB,  2, 1, 1, bbLower) < 1) return;
    if(CopyBuffer(g_hBB,  0, 1, 1, bbMid)   < 1) return;
    if(CopyBuffer(g_hRSI, 0, 1, 1, rsi)     < 1) return;
    if(CopyBuffer(g_hATR, 0, 1, 1, atr)     < 1) return;

    // Date candle anterioare
    double high1[1], low1[1], close1[1], open1[1];
    if(CopyHigh (_Symbol, PERIOD_M1, 1, 1, high1)  < 1) return;
    if(CopyLow  (_Symbol, PERIOD_M1, 1, 1, low1)   < 1) return;
    if(CopyClose(_Symbol, PERIOD_M1, 1, 1, close1)  < 1) return;
    if(CopyOpen (_Symbol, PERIOD_M1, 1, 1, open1)   < 1) return;

    double pt = SymbolInfoDouble(_Symbol, SYMBOL_POINT);

    // Filtru ATR: piata trebuie sa fie activa dar nu haotica
    double atrPts = atr[0] / pt;
    if(atrPts < InpATR_Min || atrPts > InpATR_Max) return;

    // Filtru Bandwidth: daca banda e prea larga, piata trendeaza – evitam mean reversion
    double bandwidth = (bbUpper[0] - bbLower[0]) / bbMid[0] * 100.0;
    if(bandwidth > InpBBWidth_Max) return;

    // --- SEMNAL BUY ---
    // Conditii: umbra/corpul a atins banda inferioara SI bara s-a inchis INAUNTRU
    //           + bara este bulish (inchidere > deschidere)
    //           + RSI confirma oversold
    bool longCond = (low1[0]   <= bbLower[0]) &&    // A atins/trecut banda jos
                    (close1[0]  > bbLower[0]) &&     // S-a inchis inapoi inauntru
                    (close1[0]  > open1[0])   &&     // Bara bulish (reversal confirm)
                    (rsi[0]     < InpRSI_Long);      // RSI confirma oversold

    // --- SEMNAL SELL ---
    bool shortCond = (high1[0]  >= bbUpper[0]) &&   // A atins/trecut banda sus
                     (close1[0]  < bbUpper[0]) &&    // S-a inchis inapoi inauntru
                     (close1[0]  < open1[0])   &&    // Bara bearish (reversal confirm)
                     (rsi[0]     > InpRSI_Short);    // RSI confirma overbought

    double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
    double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

    if(longCond) {
        double sl = NormalizeDouble(ask - InpSL_Points * pt, _Digits);
        double tp = NormalizeDouble(ask + InpTP_Points * pt, _Digits);
        if(g_Trade.Buy(InpLotSize, _Symbol, ask, sl, tp, "LF_BB_BUY")) {
            g_TradesToday++;
            Print("BUY #", g_TradesToday, " | ASK:", ask,
                  " | BB-Low:", bbLower[0], " | RSI:", DoubleToString(rsi[0],1),
                  " | ATR:", DoubleToString(atrPts,1), " | BW%:", DoubleToString(bandwidth,2));
        }
    }
    else if(shortCond) {
        double sl = NormalizeDouble(bid + InpSL_Points * pt, _Digits);
        double tp = NormalizeDouble(bid - InpTP_Points * pt, _Digits);
        if(g_Trade.Sell(InpLotSize, _Symbol, bid, sl, tp, "LF_BB_SELL")) {
            g_TradesToday++;
            Print("SELL #", g_TradesToday, " | BID:", bid,
                  " | BB-Up:", bbUpper[0], " | RSI:", DoubleToString(rsi[0],1),
                  " | ATR:", DoubleToString(atrPts,1), " | BW%:", DoubleToString(bandwidth,2));
        }
    }
}

//+------------------------------------------------------------------+
//| Trailing Stop – ruleaza pe fiecare tick                          |
//+------------------------------------------------------------------+
void ManageTrailingStop()
{
    double pt = SymbolInfoDouble(_Symbol, SYMBOL_POINT);

    for(int i = PositionsTotal() - 1; i >= 0; i--) {
        ulong ticket = PositionGetTicket(i);
        if(!PositionSelectByTicket(ticket))                     continue;
        if(PositionGetString(POSITION_SYMBOL) != _Symbol)       continue;
        if((int)PositionGetInteger(POSITION_MAGIC) != InpMagic) continue;

        double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
        double curSL     = PositionGetDouble(POSITION_SL);
        double curTP     = PositionGetDouble(POSITION_TP);
        int    posType   = (int)PositionGetInteger(POSITION_TYPE);

        if(posType == POSITION_TYPE_BUY) {
            double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
            double profitPts = (bid - openPrice) / pt;
            if(profitPts >= InpTrailStart) {
                double newSL = NormalizeDouble(bid - InpTrailStep * pt, _Digits);
                if(newSL > curSL + pt)
                    g_Trade.PositionModify(ticket, newSL, curTP);
            }
        }
        else if(posType == POSITION_TYPE_SELL) {
            double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
            double profitPts = (openPrice - ask) / pt;
            if(profitPts >= InpTrailStart) {
                double newSL = NormalizeDouble(ask + InpTrailStep * pt, _Digits);
                if(curSL == 0 || newSL < curSL - pt)
                    g_Trade.PositionModify(ticket, newSL, curTP);
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Reset zilnic + control drawdown                                  |
//+------------------------------------------------------------------+
void CheckNewDay()
{
    datetime today = (datetime)((long)TimeCurrent() / 86400 * 86400);
    if(today != g_LastDay) {
        g_LastDay     = today;
        g_TradesToday = 0;
        g_DayBalance  = AccountInfoDouble(ACCOUNT_BALANCE);
        g_DayStop     = false;
        Print("--- Zi noua. Balanta start: ", g_DayBalance, " ---");
    }

    // Verifica drawdown zilnic in timp real (include pozitii deschise)
    double balance = AccountInfoDouble(ACCOUNT_BALANCE);
    double equity  = AccountInfoDouble(ACCOUNT_EQUITY);
    double worst   = MathMin(balance, equity);
    double lossPct = (g_DayBalance - worst) / g_DayBalance * 100.0;

    if(!g_DayStop && lossPct >= InpMaxDailyLoss) {
        g_DayStop = true;
        string msg = StringFormat(
            "!!! LIMITA ZILNICA ATINSA: %.2f%% pierdere. Inchid toate si stop.", lossPct);
        Print(msg);
        Alert(msg);
        CloseAllPositions();
    }
}

//+------------------------------------------------------------------+
void CloseAllPositions()
{
    for(int i = PositionsTotal() - 1; i >= 0; i--) {
        ulong ticket = PositionGetTicket(i);
        if(!PositionSelectByTicket(ticket))                     continue;
        if(PositionGetString(POSITION_SYMBOL) != _Symbol)       continue;
        if((int)PositionGetInteger(POSITION_MAGIC) != InpMagic) continue;
        g_Trade.PositionClose(ticket, 50);
    }
}

//+------------------------------------------------------------------+
int CountPositions()
{
    int cnt = 0;
    for(int i = PositionsTotal() - 1; i >= 0; i--) {
        if(PositionGetSymbol(i) == _Symbol &&
           (int)PositionGetInteger(POSITION_MAGIC) == InpMagic)
            cnt++;
    }
    return cnt;
}

//+------------------------------------------------------------------+
bool IsSessionOpen()
{
    MqlDateTime dt;
    TimeToStruct(TimeCurrent(), dt);
    return (dt.hour >= InpSessStart && dt.hour < InpSessEnd);
}

//+------------------------------------------------------------------+
bool SpreadTooHigh()
{
    long spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
    return (spread > InpMaxSpread);
}

//+------------------------------------------------------------------+
void PrintCostAnalysis()
{
    double pt       = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
    double tickVal  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
    double ptVal    = tickVal / SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE) * pt;
    double costPerLot = 20.0 + 20.0; // spread + comision = $40/lot

    Print("--- Analiza costuri XAUUSD ---");
    Print("Valoare 1 punct: $", DoubleToString(ptVal * InpLotSize, 4));
    Print("Cost total/lot: $40 (spread $20 + comision $20)");
    PrintFormat("TP %.0f puncte -> profit net brut: $%.2f/lot",
                (double)InpTP_Points, InpTP_Points * ptVal * InpLotSize - 20.0);
    PrintFormat("SL %.0f puncte -> pierdere neta: $%.2f/lot",
                (double)InpSL_Points, InpSL_Points * ptVal * InpLotSize + 20.0);
    double winRateNeeded = (InpSL_Points * ptVal * InpLotSize + 20.0) /
                           ((InpTP_Points + InpSL_Points) * ptVal * InpLotSize) * 100;
    PrintFormat("Rata castig necesara break-even: %.1f%%", winRateNeeded);
}
