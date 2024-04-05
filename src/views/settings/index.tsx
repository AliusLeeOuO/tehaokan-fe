import { Checkbox, Message, Modal, Radio, Select, Link } from "@arco-design/web-react"
import style from "./index.module.less"
import DeleteIcon from "../../components/icons/deleteIcon.tsx"
import pkg from "../../../package.json"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

const RadioGroup = Radio.Group

// TODO: 设置功能使用redux+redux持久化实现 等待实现
// 字体设置尝试使用JS实现


export default function Settings() {
  const Option = Select.Option
  const options = ["系统字体", "HarmonyOS Sans"]
  const attribute = parseInt(document.documentElement.getAttribute("data-build-timestamp")!)
  const [licenseVisible, setLicenseVisible] = useState<boolean>(false)
  const [historyCount, setHistoryCount] = useState(0)

  const fetchHistoryCount = () => {
    const handlerQueryHistoryCountReply = (_event: any, historyCount: number) => {
      setHistoryCount(historyCount)
    }
    window.ipcRenderer.off("get-history-count-reply", handlerQueryHistoryCountReply)
    window.ipcRenderer.send("get-history-count")
    window.ipcRenderer.on("get-history-count-reply", handlerQueryHistoryCountReply)
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
          return await new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          })
        } catch (e) {
          Message.error({
            content: "Error occurs!"
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
            <RadioGroup direction="vertical" defaultValue="a" className={style.radioStyle}>
              <Radio value="a">最小化到系统托盘</Radio>
              <Radio value="b">退出特好看程序</Radio>
            </RadioGroup>
          </div>
          <div>
            <Checkbox>关闭前提示</Checkbox>
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
        <div>编译日期：{dayjs(attribute).format("YYYY年MM月DD日 HH:mm:ss")}</div>
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
        documentation files (the "Software"), to deal in the Software without restriction, including without limitation
        the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
        to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      </p>
      <p>
        The above copyright notice and this permission notice shall be included in all copies or substantial portions of
        the Software.
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
        THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
        CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
        DEALINGS IN THE SOFTWARE.
      </p>
    </Modal>
  </>
}