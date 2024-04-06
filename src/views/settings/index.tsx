import { Checkbox, Message, Modal, Radio, Select, Link } from "@arco-design/web-react"
import style from "./index.module.less"
import DeleteIcon from "../../components/icons/deleteIcon.tsx"
import pkg from "../../../package.json"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store.ts"
import { setConfirmOnClose, setMinimizeToTray } from "../../store/settingsSlice.ts"
// import { useSelector } from "react-redux"
// import { RootState } from "../../store/store.ts"

const RadioGroup = Radio.Group

export default function Settings() {
  const dispatch = useDispatch()
  // 从 Redux state 读取 minimizeToTray 设置
  const minimizeToTray = useSelector((state: RootState) => state.settings.minimizeToTray)
  const confirmOnClose = useSelector((state: RootState) => state.settings.confirmOnClose)
  const Option = Select.Option
  const options = ["系统字体", "HarmonyOS Sans"]
  const attribute = parseInt(document.documentElement.getAttribute("data-build-timestamp")!)
  const [licenseVisible, setLicenseVisible] = useState<boolean>(false)
  const [historyCount, setHistoryCount] = useState(0)

  // 定义 onChange 处理函数
  const handleExitSettingsChange = (value: string) => {
    // 根据选中的值更新 minimizeToTray 设置
    dispatch(setMinimizeToTray(value === "minimize"))
  }
  const handleExitConfirmOnCloseChange = (value: boolean) => {
    dispatch(setConfirmOnClose(value))
  }


  const fetchHistoryCount = () => {
    const handlerQueryHistoryCountReply = (_event: any, historyCount: number) => {
      setHistoryCount(historyCount)
    }
    window.ipcRenderer.off("get-history-count-reply", handlerQueryHistoryCountReply)
    window.ipcRenderer.send("get-history-count")
    window.ipcRenderer.on("get-history-count-reply", handlerQueryHistoryCountReply)
  }

  const dropHistoryRecord = () => {
    return new Promise((resolve, reject) => {
      const handlerDropHistoryRecord = (_event: any, result: string) => {
        // 在处理完毕后，移除监听器
        window.ipcRenderer.off("drop-history-data-reply", handlerDropHistoryRecord)

        // 根据操作结果，决定是解决（resolve）还是拒绝（reject）Promise
        if (result === "Success") {
          resolve("所有历史记录已成功删除。")
        } else {
          reject(new Error("删除历史记录失败。"))
        }
      }

      // 发送 IPC 消息请求删除所有历史记录
      window.ipcRenderer.on("drop-history-data-reply", handlerDropHistoryRecord)
      window.ipcRenderer.send("drop-history-data")
    })
  }

  useEffect(() => {
    fetchHistoryCount()
    return () => {
      window.ipcRenderer.removeAllListeners("get-history-count-reply")
    }
  }, [])


  function confirmDropHistoryData() {
    Modal.confirm({
      style: {
        width: "auto"
      },
      title: "删除历史数据",
      content:
        "确定要删除历史数据吗？该操作不可恢复",
      okButtonProps: {
        status: "danger"
      },
      onOk: async () => {
        try {
          await dropHistoryRecord()
          fetchHistoryCount()
          Message.success({
            content: "历史记录删除完成。"
          })
        } catch (e) {
          Message.error({
            content: "删除失败。"
          })
          throw e
        }
      }
    })
  }

  return <>
    <div className={style.settingsContainer}>
      <div className={style.settingsBox}>
        <div className={style.settingsTitle}>常规设置</div>
        <div className={style.settingsItem}>
          <div className={style.itemTitle}>关闭主界面时：</div>
          <div>
            <RadioGroup
              direction="vertical"
              value={minimizeToTray ? "minimize" : "exit"}
              onChange={(value) => {
                handleExitSettingsChange(value)
              }}
              className={style.radioStyle}
            >
              <Radio value="minimize">最小化到系统托盘</Radio>
              <Radio value="exit">退出特好看程序</Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox
              checked={confirmOnClose}
              onChange={(checked: boolean) => {
                handleExitConfirmOnCloseChange(checked)
              }}
            >关闭前提示</Checkbox>
          </div>
        </div>
        <div className={style.settingsItem}>
          <div className={style.itemTitle}>字体设置：</div>
          <div>
            <Select
              placeholder="Please select"
              style={{ width: 250 }}
              onChange={(value) =>
                Message.info({
                  content: `You select ${value}.`,
                  showIcon: true
                })
              }
            >
              {options.map((option, _index) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className={style.settingsBox}>
        <div className={style.settingsTitle}>隐私数据</div>
        <div className={style.settingsItem}>
          <div>
            当前历史数据： {historyCount}条
          </div>
          <div className={style.settingsButton} onClick={confirmDropHistoryData}>
            <DeleteIcon />
            <span>清空历史数据</span>
          </div>
        </div>
      </div>
      <div className={style.settingsBox}>
        <div className={style.settingsTitle}>关于特好看</div>
        <div>程序版本：v{pkg.version}</div>
        <div>程序构建日期：{dayjs(attribute).format("YYYY年MM月DD日 HH:mm:ss")}</div>
        <div>
          Based on Electron {navigator.userAgent.match(/Electron\/([\d.]+\d+)/)![1]}
          &nbsp;
          Chromium {navigator.userAgent.match(/Chrome\/([\d.]+\d+)/)![1]}
        </div>
        <div>广西民族师范学院毕业设计</div>
        <div>通信204班 203023020403 林科圻</div>
        <Link onClick={() => setLicenseVisible(true)} style={{ transform: "translateX(-4px)" }}>
          开源许可证：MIT License
        </Link>
      </div>
    </div>
    <Modal
      title="开源许可证"
      visible={licenseVisible}
      okText="关闭"
      hideCancel={true}
      closable={true}
      onOk={() => setLicenseVisible(false)}
      onCancel={() => setLicenseVisible(false)}
    >
      <p>MIT License</p>
      <p>Copyright (c) 2024-PRESENT Alius Lee&lt;https://github.com/AliusLeeOuO&gt;</p>
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
        documentation files (the "Software"), to deal in the Software without restriction, including without
        limitation
        the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
        and
        to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      </p>
      <p>
        The above copyright notice and this permission notice shall be included in all copies or substantial portions
        of
        the Software.
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
        TO
        THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
        CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </p>
    </Modal>
  </>
}