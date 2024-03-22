import Player from "xgplayer"
import "xgplayer/dist/index.min.css"
import style from "./index.module.less"
import CloseIcon from "../../components/icons/closeIcon.tsx"
import MinimizeIcon from "../../components/icons/minimizeIcon.tsx"
import MaximizeIcon from "../../components/icons/maximizeIcon.tsx"
import { useEffect } from "react"

export default function PlayerComponent() {
  useEffect(() => {
    new Player({
      id: "player-container",
      height: "100%",
      width: "100%",
      playbackRate: [],
      cssFullscreen: false,
      volume: 1,
      poster: "https://media-gzga-fy-person.gz9oss.ctyunxs.cn/PERSONCLOUD/4e92ea34-8777-4ff3-b419-c8d30c625799.webp?response-content-disposition=attachment%3Bfilename%3D%22cover.webp%22%3Bfilename*%3DUTF-8%27%27cover.webp&x-amz-CLIENTNETWORK=UNKNOWN&x-amz-CLOUDTYPEIN=PERSON&x-amz-CLIENTTYPEIN=PC&Signature=muXgZFR5wEmRM7x1/AqUjDsgkEU%3D&AWSAccessKeyId=0Lg7dAq3ZfHvePP8DKEU&x-amz-userLevel=200&Expires=1711129084&x-amz-limitrate=51200&x-amz-FSIZE=194464&x-amz-UID=107816479&x-amz-UFID=224491124632396276",
      url: "https://media-gdgz-fy-person.gd5oss.ctyunxs.cn/PERSONCLOUD/090e1db2-8eea-49ed-89f9-659b50f11d76.mkv?response-content-disposition=attachment%3Bfilename%3D%22S01E01.2024.2160p.NF.WEB-DL.DDP5.1.Atmos.H.265-HHWEB%20%281%29.mkv%22%3Bfilename*%3DUTF-8%27%27S01E01.2024.2160p.NF.WEB-DL.DDP5.1.Atmos.H.265-HHWEB%2B%25281%2529.mkv&x-amz-CLIENTNETWORK=UNKNOWN&x-amz-CLOUDTYPEIN=PERSON&x-amz-CLIENTTYPEIN=PC&Signature=1Rmr31eGFjKWU2i2f9YopUhxqOk%3D&AWSAccessKeyId=g6jU1T3TkAbPKf5ouH5d&x-amz-userLevel=200&Expires=1711157704&x-amz-limitrate=51200&x-amz-FSIZE=7580087215&x-amz-UID=107816479&x-amz-UFID=523883124625639955"
    })
  }, [])

  return (
    <>
      <div className={style.tab}>
        <div className={style.resourceName}>
          我是标题
        </div>
        <div className={style.actionButtons}>
          <div className={style.actionButton}>
            <MinimizeIcon />
          </div>
          <div className={style.actionButton}>
            <MaximizeIcon />
          </div>
          <div className={style.actionButton}>
            <CloseIcon />
          </div>
        </div>
      </div>
      <div className={style.player}>
        <div id="player-container"></div>
      </div>
    </>
  )
}