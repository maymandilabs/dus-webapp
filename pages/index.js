import Head from 'next/head';
import styles from '../styles/Home.module.css';
import 'bootstrap/dist/css/bootstrap.css'
import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
const config = require("../config.js");
import { useQRCode } from 'next-qrcode';

export default function Home() {
    const { Canvas } = useQRCode();

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [formVals, setFormVals] = useState({success: false, url: "N/A", qr: false, loading: false});
    const [url, setURL] = useState('');

    useEffect(()=>{
        if (typeof window.ethereum !== 'undefined') {
            setProvider(new ethers.BrowserProvider(window.ethereum));
        }
    }, []);

    const handleConnect = async () => {
        var s = await provider.getSigner();
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x89"}], // Polygon Chain
          });
          setSigner(s);
        } catch (e){
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainName: 'Polygon Mainnet',
              chainId: '0x89',
              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              rpcUrls: ['https://polygon-rpc.com/']
            }]
          });
          setSigner(s);
        }
    }  
    
    const handleSubmit = async () => {
        setFormVals({success: false, url: "N/A", qr: false, loading: true});
        var contract = new ethers.Contract(config.CONTRACT_ADDRESS, config.CONTRACT_ABI, provider);
        var id = await generateUniqueId(contract);
        var contractSigner = contract.connect(signer);
        var tx = await contractSigner.setURL(id, url);
        await tx.wait();
        const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
        var shortURL =  origin + "/p" + id;
        setFormVals({success: true, url: shortURL, qr: true, loading: false});
    }

  return (
    <div className={styles.container}>
      <Head>
        <title>DUS - A Decentralized URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    
      { signer && <p>- Connected -</p>}
      <main>
        <h1 className={styles.title}>
          DUS
        </h1>

        <p className={styles.description}>
          An Open Source Decentralized URL Shortener - Built On Polygon
        </p>

        <p className={styles.headtext}>
          Your URLs will never die. They'll always exist on the blockchain!
        </p>
        
        <br></br>
        <div className={styles.urlForm} style={{display: formVals.success ? "block" : "none"}}>
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Your shortened URL is available at: <a href={formVals.url} target="_blank"><strong>{formVals.url}</strong></a>
            <p></p>
            <p>Additionally, a QR code for the generated shortened URL is provided below: </p>
          </div>
          <center>
            <Canvas
              text={formVals.url}
              options={{
                level: 'M',
                margin: 3,
                scale: 4,
                width: 200,
              }}
            />
          </center>
        </div>

        <p style={{display: provider ? "none" : "block", textAlign: "center"}}>We couldn't detect a web3 wallet. You can download <a href="https://metamask.io/" target="_blank" >MetaMask</a> to get started!</p>
        <br></br>
        <button onClick={handleConnect} className="btn btn-primary" style={{display: signer ? "none" : "block"}}>Connect Wallet</button>
        <div className={styles.urlForm} style={{display: signer ? "block" : "none"}}>
            <input type="url" name="url" value={url} onChange={e => { setURL(e.currentTarget.value); }} className="form-control" placeholder="Your URL" style={{textAlign: "center"}} required></input>
            <br></br>
            <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary" style={{display: formVals.loading ? "none" : "block"}} onClick={handleSubmit}>Shorten!</button>
                <button className="btn btn-primary" type="button" style={{display: formVals.loading ? "block" : "none"}} disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Processing...
                </button>
            </div>
        </div>

      </main>

      <footer>
        <p></p>
          <a href="https://maymandi.com" target='_blank'>
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
        //   display: flex;
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
        footer p {
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

function generateId(length) {
    var chars = "aAbBcCdD9eEfFg3GhHiI4jJkKlLmM5n0NoOpPqQr2RsStTu16UvVwW7xXyY8zZ"
    var id = "";
    for (var i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * 62)];
    }
    return id;
}

async function generateUniqueId(contract){
	var id = "N/A";
	while (id == "N/A"){
        id = generateId(6);
        if (await getURL(contract, "p" + id) != "N/A"){
            id = "N/A";
        }
    }
	return id;
}

async function getURL(contract, id){
    try {
        var url = await contract.getURL(id);
        return url;
    } catch (e){
        return "N/A";
    }
}
