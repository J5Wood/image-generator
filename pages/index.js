import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from "axios";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: searchInput,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );
      if (response.status !== 200) {
        throw (
          response.data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(response.data.data[0].url);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Head>
        <title>Image Creator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Create Images from a Prompt</h3>
        <p>Powered by DALL-E</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder=""
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <input type="submit" value="Generate Image" />
        </form>
        <img className={styles.result} src={result} />
      </main>
    </div>
  );
}
