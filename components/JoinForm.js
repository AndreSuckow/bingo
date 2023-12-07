import * as React from "react";
import { useRouter } from "next/router";

//styles
import styles from "../styles/JoinForm.module.css";

export default function JoinForm(props) {
  const router = useRouter();
  const { godMode } = router.query;
  const [name2, setName2] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [qtdBalls, setQtdBalls] = React.useState(99);
  const [gameOption, setGameOption] = React.useState("default");

  switch (props.type) {
    case "room":
      return (
        <>
          <label className={styles.label}>Seu nome</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            name="room"
            type="text"
          ></input>
          <button
            className={`${styles.btn_enter} ${styles.red_color}`}
            onClick={() => props.btnFunction(props.room, name2)}
          >
            Entrar
          </button>
        </>
      );
    case "home":
      return (
        <>
          <label className={styles.label}>ID da Sala</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            name="room"
            type="text"
          ></input>
          <label className={styles.label}>Seu nome</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            name="room"
            type="text"
          ></input>
          <button
            className={`${styles.btn_enter} ${styles.red_color}`}
            onClick={() => props.btnFunction(room, name2, "join")}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Entrar
          </button>
          {godMode && godMode === "Admin" && (
            <>
              <span className={styles.division}> ............. </span>
              <button
                className={`${styles.btn_enter} ${styles.bgc_dark_blue}`}
                onClick={() => props.btnFunction(room, name2, "create")}
              >
                Criar Sala
              </button>
            </>
          )}
        </>
      );
    case "host":
      return (
        <>
          <label className={styles.label}>Id da Sala</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            name="room"
            type="text"
          ></input>
          {props.roomAvailability && (
            <p> Essa sala já foi criada. Crie outra sala </p>
          )}
          <label className={styles.label}>Quantidade de bolas</label>
          <input
            className={styles.input}
            value={qtdBalls}
            onChange={(e) => setQtdBalls(e.target.value)}
            name="qtdBalls"
            min={30}
            max={99}
            type="number"
          ></input>
          <button
            className={`${styles.btn_enter} ${styles.red_color}`}
            onClick={() => props.btnFunction(room, qtdBalls, gameOption)}
          >
            Criar
          </button>
        </>
      );
  }
}
