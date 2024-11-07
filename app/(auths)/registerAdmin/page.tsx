
import Register from '@/components/register'
import React from 'react'

const page = () => {
  return (
    <div>
      {/* 보안을 위해선 otp 같은 걸로 fetch 주소가 털려도 가입을 할 수 없도록 하는 장치를 만들어야겠다. */}
      <Register fetchUrl={'/api/registerAdmin'} />
    </div>
  )
}

export default page
