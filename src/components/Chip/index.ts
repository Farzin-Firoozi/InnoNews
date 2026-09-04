import ChipComponent from './Chip'
import ChipSkeletonComponent from './Chip.skeleton'

const Chip = Object.assign(ChipComponent, {
  Skeleton: ChipSkeletonComponent,
})

export default Chip
