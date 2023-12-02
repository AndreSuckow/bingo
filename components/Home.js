import * as React from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

import JoinForm from "./JoinForm";

export default function Home(props) {
  const router = useRouter();

  async function findRoom(room) {
    test();
    const res = await fetch(`/api/socket?option=room&room=${room}`);
    const posts = await res.json();
    return posts.thereIs;
  }
  const test = async () => {
    await fetch("/api/socket?option=connection");
  };

  const handleJoinRoom = (room_, name_, option) => {
    switch (option) {
      case "join":
        findRoom(room_).then((thereIs) => {
          if (!thereIs) {
            window.alert("Nenhuma sala encontrada!");
            return;
          }
          if (!name_) {
            window.alert("Você precisa digitar seu nome!");
            return;
          }
          router.push(`${room_}?name=${name_}`);
        });

        break;
      case "create":
        props.path("create-room");
        break;
    }
  };

  return (
    <div className={styles.main}>
      <img className={styles.img} src="/logoGrande.png"></img>
      <div className={styles.flex_collum}>
        <JoinForm type="home" btnFunction={handleJoinRoom} />
      </div>
    </div>
  );
}
