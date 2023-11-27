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

  // React.useEffect(() => {
  //   console.log(cartela);
  // }, [cartela]);

  function findCartela(numero, socket) {
    let cartelaLocal = localStorage.getItem("player-cartela");
    if (!cartelaLocal) {
      let cartela = numero;
      setCartela(cartela);
      localStorage.setItem("player-cartela", JSON.stringify(cartela));
    } else {
      let parsedCartela = cartelaLocal.split(",");
      setCartela(parsedCartela);
      console.log(socket);
      socket.emit("player-with-cartela", parsedCartela);
    }
  }

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

  const joinRoom = (room_, name_) => {
    socket.emit("join-room", room_);
    console.log("join-room");
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
            </div>
            <div className={styles.riffled_info}>
              <p> 10 últimas bolas sorteadas:</p>
              <BingoDisplay
                type="player"
                max={10} // ANDRÉ: mostra as últimas 5 bolas para o player
                numbers={raffleds}
              />
              <button className={styles.btn_bingo} onClick={bingo}>
                Bingo!
              </button>
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
