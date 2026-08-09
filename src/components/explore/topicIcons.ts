import {
  Activity,
  Boxes,
  CircleDotDashed,
  Gauge,
  MoveUpRight,
  Orbit,
  Zap,
} from 'lucide-react'
import type { TopicIconName } from '../../types/topic'

export const topicIcons = {
  kinematics: Gauge,
  forces: MoveUpRight,
  energy: Zap,
  momentum: Boxes,
  'circular-motion': Orbit,
  projectiles: Activity,
  oscillations: CircleDotDashed,
} satisfies Record<TopicIconName, typeof Gauge>
