import Pay from './Pay'
import SignMessage from './SIngMessage'
import SmartButton from './SmartButton'
import VerifyMessage from './VerifyMessage'
import WithdrawAll from './WithdrawAll'

export default function App() {
  return (
    <div className='flex flex-wrap'>
      {/* <div className='w-full lg:w-1/2'>
         <SignMessage />
      </div>
      <div className='w-full lg:w-1/2'>
        <VerifyMessage />
      </div>
      <div className='w-full lg:w-1/2'>
        <Pay />
      </div> */}
      <div className='w-full lg:w-1/2'>
        <SmartButton />
      </div>
      <div className='w-full lg:w-1/2'>
        <WithdrawAll />
      </div>
    </div>
  )
}
