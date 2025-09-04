import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useEffect} from 'react'
const DM = require("../dmod/index.js");

function Page({params}) {
  if (params[0] == "redirect"){
    useEffect(() => {
      window.location.assign(params[1])
    })
    return(
        <>
        </>
    )
  } else {
    return (
      <div className={styles.container}>
        <Head>
          <title>DUS - A Decentralized URL Shortener</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <h1 className={styles.title}>
            DUS
          </h1>
  
          <p className={styles.description}>
            The given URL does not exist!
          </p>
  
        </main>
  
        <footer>
          <p></p>
          <a href="https://maymandi.com">
            Built With ❤️ By Maymandi Labs
          </a>
        </footer>
  
        <style jsx>{`
          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          footer {
            width: 100%;
            height: 60px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          footer img {
            margin-left: 0.5rem;
          }
          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            color: inherit;
          }
          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }
        `}</style>
  
        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  }
}

Page.getInitialProps = async function({query}) {
  var id = query["id"];
  var url = await DM.functions.getURL(id);
  
  if (url == "N/A"){
    return { params: ["N/A", "N/A"] }
  }

  return { params: ["redirect", url] }
}

export default Page