import { Spin } from 'antd'

export default () => {
  return (
    <div className="root">
      <Spin />
      <style jsx>{`
          .root {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(255,255,255,0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
          }
        `}</style>
    </div>
  )
}