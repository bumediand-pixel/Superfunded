import { GraduationCap } from 'lucide-react';
import { SKILL_EVAL_DISCLAIMER } from '@/lib/legal';

export default function SkillEvalBanner() {
  return (
    <div className="px-4 py-2.5 flex items-center gap-2 text-xs"
      style={{
        background: 'rgba(230, 57, 70, 0.08)',
        borderBottom: '1px solid rgba(230, 57, 70, 0.18)',
        color: 'rgba(255, 255, 255, 0.75)',
      }}>
      <GraduationCap className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--red)' }} />
      <span className="leading-snug">{SKILL_EVAL_DISCLAIMER.dashboard}</span>
    </div>
  );
}
