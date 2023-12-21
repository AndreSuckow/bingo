import { useRouter } from "next/router";
import * as React from "react";
import io from "socket.io-client";

//styles
import styles from "../styles/PlayerScreen.module.css";

//components
import ChatDisplay from "../components/ChatDisplay";
import JoinForm from "../components/JoinForm";
import BingoDisplay from "../components/BingoDisplay";
import PlayerDisplay from "../components/PlayerDisplay";
import BingoWinner from "../components/BingoWinner";

let socket;
export default function Room() {
  const router = useRouter();
  const { room, name } = router.query;
  const [name2, setName2] = React.useState(name);
  const [path, setPath] = React.useState(" ");
  const [chat, setChat] = React.useState([]);
  const [cartela, setCartela] = React.useState([]);
  const [raffleds, setRaffleds] = React.useState([]);
  const [bingoWinner, setBingoWinner] = React.useState("");

  React.useEffect(() => {
    socketInitializer(name);
  }, [name]);

  //set event listeners
  const socketInitializer = async (name_) => {
    try {
      console.log("here 1");
      await fetch("/api/socket?option=connection");
      socket = io();
      socket.on("connect", () => {
        if (name_ != undefined) joinRoom(room, name);
      });

      socket.on("get-players", (msg) => {
        //get players
        //setPlayers(msg);
      });

      socket.on("get-chat", (msg) => {
        setChat((prev) => [...prev, msg]);
      });

      socket.on("get-cartela", (msg) => {
        //get player raffled numbers
        // findCartela(msg, socket);
        setCartela(msg);
      });

      socket.on("get-raffleds", (msg) => {
        //get raffled balls
        setRaffleds(msg);
      });

      socket.on("start-game", () => {
        //start game
        setPath("play-room");
      });

      socket.on("get-bingo", (msg) => {
        //bingo
        setPath("bingo");
        setBingoWinner(msg);
      });
    } catch (e) {
      console.log("error: ", e);
    }
  };

  let audioRef = React.useRef();

  const [soundOn, setSoundOn] = React.useState(true);
  function SoundOfBingo() {
    debugger;
    if (!soundOn) {
      if (audioRef) {
        audioRef.play();
      }
    } else {
      if (audioRef) {
        audioRef.pause();
        audioRef.style.background = "url('../public/sound_off.png')";
      }
    }
    setSoundOn(!soundOn);
  }

  const joinRoom = (room_, name_) => {
    socket.emit("join-room", room_);
    socket.emit("send-to-host", { room: room_, name: name_, id: socket.id });
    setName2(name_);
    setPath("wait");
  };

  const handleChat = (name_, msg_) => {
    socket.emit("send-chat", { room: room, name: name_, msg: msg_ });
    setChat((prev) => [...prev, { name: "sent-200", msg: msg_ }]);
  };

  const bingo = () => {
    let count = 0;
    cartela.map((el) => {
      if (raffleds.find((ele) => ele === el) != undefined) count++;
    });

    if (cartela.length == count) {
      setPath("bingo");
      setBingoWinner(name2);
      socket.emit("send-bingo", room, name2);
    } else {
      window.alert("Para ser bingo, toda a sua cartela precisa ser sorteada.");
    }
  };

  const displayChat = (option) => {
    return (
      <ChatDisplay
        name={name2}
        content={chat}
        btnFunction={handleChat}
        cartela={cartela}
        onGame={option == "on-game" ? true : false}
      />
    );
  };

  switch (path) {
    case "wait":
      return displayChat();

    case "play-room":
      return (
        <>
          {displayChat("on-game")}
          <section className={styles.main_play}>
            <div className={styles.info}>
              <p>{name2}</p>
              <p>Marque as bolas sorteadas:</p>
              <PlayerDisplay numbers={cartela.sort((a, b) => a - b)} />
              <button className={styles.btn_bingo} onClick={bingo}>
                Bingo!
              </button>
              <button className={styles.btn_sound} onClick={SoundOfBingo}>
                {soundOn && (
                  <img className={styles.gif} src="/sound_on.gif"></img>
                )}
                {!soundOn && (
                  <img className={styles.gif} src="/sound_off.png"></img>
                )}
              </button>
              <audio
                src="/sorteio.mp3"
                ref={(ref) => {
                  audioRef = ref;
                  if (audioRef) {
                    audioRef.volume = 0.01;
                    audioRef.loop = true;
                  }
                }}
                autoPlay
              ></audio>
            </div>
            <div className={styles.riffled_info}>
              <p>Bolas sorteadas:</p>
              <BingoDisplay
                type="player"
                max={99} // ANDRÉ: mostra as últimas bolas para o player
                numbers={raffleds}
              />
            </div>
          </section>
        </>
      );
    case "bingo":
      return (
        <>
          {displayChat("on-game")}
          <BingoWinner winner={bingoWinner} />
        </>
      );
    default:
      return (
        <>
          <section className={styles.main}>
            <p>
              Bem-vind@ {name} à sala {room}
            </p>
            {name == undefined && (
              <JoinForm type="room" btnFunction={joinRoom} room={room} />
            )}
          </section>
        </>
      );
  }
}
