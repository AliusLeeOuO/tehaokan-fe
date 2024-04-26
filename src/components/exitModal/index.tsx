import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Modal, Radio, Checkbox } from "@arco-design/web-react"
import { RootState } from "../../store/store" // 确保路径正确
import { setConfirmOnClose, setMinimizeToTray } from "../../store/settingsSlice"
import "./index.override.less"
import style from "./index.module.less"

interface ExitModalProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const ExitModal: React.FC<ExitModalProps> = ({ visible, setVisible }) => {
  const dispatch = useDispatch()
  const minimizeToTray = useSelector((state: RootState) => state.settings.minimizeToTray)
  const confirmOnClose = useSelector((state: RootState) => state.settings.confirmOnClose)

  const handleExitSettingsChange = (value: string) => {
    dispatch(setMinimizeToTray(value === "minimize"))
  }

  const handleExitConfirmOnCloseChange = (checked: boolean) => {
    dispatch(setConfirmOnClose(checked))
  }

  const conformCloseCallBack = () => {
    if (minimizeToTray) {
      setVisible(false)
      window.ipcRenderer.send("minimize-to-tray")
    } else {
      window.ipcRenderer.send("close-window")
    }
  }

  return (
    <Modal
      title="点击关闭按钮后："
      visible={visible}
      simple={true}
      closable={true}
      onOk={conformCloseCallBack}
      onCancel={() => setVisible(false)}
      className="exitModal"
    >
      <div>
        <Radio.Group
          direction="vertical"
          value={minimizeToTray ? "minimize" : "exit"}
          onChange={(value) => handleExitSettingsChange(value)}
          className={style.radioStyle}
        >
          <Radio value="minimize">最小化到系统托盘</Radio>
          <Radio value="exit">退出程序</Radio>
        </Radio.Group>
      </div>
      <div>
        <Checkbox
          checked={confirmOnClose}
          onChange={(checked: boolean) => handleExitConfirmOnCloseChange(checked)}
        >关闭前提示</Checkbox>
      </div>
    </Modal>
  )
}

export default ExitModal
