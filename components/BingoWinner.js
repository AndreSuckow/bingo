import styles from "../styles/BingoWinner.module.css";
import { useRouter } from "next/router";
let RodadaBingo = 0;

export default function BingoWinner(props) {
  const router = useRouter();
  const { room, name } = router.query;
  console.log(room);
  console.log(name);
  RodadaBingo++;
  console.log(RodadaBingo);
  return (
    <section className={styles.main}>
      <p className={styles.title}>{props.winner} venceu!</p>
      <button className={styles.btnNextGame}>
        <a href="https://bingo-production-367f.up.railway.app/">
          Voltar para o menu inicial
        </a>
      </button>
    </section>
  );
}
