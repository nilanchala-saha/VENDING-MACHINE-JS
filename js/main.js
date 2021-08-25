const PRODUCTS_API = 'https://6125c6282d4e0d0017b6c45e.mockapi.io/api/products'
const BALANCE_API = 'https://6125c6282d4e0d0017b6c45e.mockapi.io/api/balance'
const PURCHASED_PRODUCTS_API =
  'https://6125c6282d4e0d0017b6c45e.mockapi.io/api/purchasedproducts'

let bankMoneyNote = [5, 10, 20, 50, 100, 500]
let productList = []
let balance = {}
let purchasedProductList = []

class PurchasedProduct {
  constructor(product) {
    this.id = product.id
    this.productId = product.id
    this.name = product.name
    this.price = product.price
    this.quantity = product.quantity
    this.image = product.image
  }
}

window.onload = () => {
  render()
}

const render = async () => {

    document.getElementById('walletProgressBar').classList.remove('d-none')
    
    document.getElementById('prouductProgressBar').classList.remove('d-none')
    
     document
       .getElementById('purchasedProductsProgressBar')
       .classList.remove('d-none')

  await fetchBalance()
  await fetchProducts()
  await fetchPurchasesProducts()

  renderProducts()
  renderBalance(balance.amount)
  renderBalanceNotes()
  renderPurchasedProducts()
}

const renderBalance = (balanceAmount) => {
     document.getElementById('walletProgressBar').classList.add('d-none')

    document
      .getElementById('walletCard')
      .innerHTML = 
        `<h5 class="card-title">Available Balance : ₹ ${balanceAmount} </h5>`
}
const renderProducts = () => {
  let productListCards = ''

  productList.map((product) => {
    if (balance.amount >= product.price && !(product.quantity === 0)) {
      productListCards += `<div class="col w-22 col-2"> <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Name : ${product.name}</p>
                        <p class="card-text">Price : ${product.price}</p>
                        <p class="card-text">Quantity : ${product.quantity}</p>
                        <p class="card-text"><button onclick="handleBuyProduct('${product.id}')" class="btn btn-md w-100 btn-primary">Buy</button></p>
                    </div>
              </div></div>`
    } else {
      productListCards += `<div class="col  w-22 col-2"> <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Name : ${product.name}</p>
                        <p class="card-text">Price : ${product.price}</p>
                        <p class="card-text">Quantity : ${product.quantity}</p>
                        <p class="card-text"><button disabled onclick="handleBuyProduct('${product.id}')" class="btn btn-md w-100 btn-primary">Buy</button></p>
                    </div>
              </div></div>`
    }
  })

    document.getElementById('prouductProgressBar').classList.add('d-none')

        document.getElementById('productCards').innerHTML = productListCards
}

const renderBalanceNotes = () => {
  let bankNotes = ''

  bankMoneyNote.map((rupees) => {
    bankNotes += `
                <div class="col p-1">
                  <button onclick="handleAddMoneyToWallet(${rupees})" class="btn btn-sm w-100 btn-primary">
                             ₹ ${rupees}             
                  </button>
                </div>`
  })
    document.getElementById('bankNotesCard').innerHTML = bankNotes
}

const renderPurchasedProducts = () => {
  let purchasedProductListCards = ''

  purchasedProductList.map((purchasedProduct) => {
    purchasedProductListCards += `
                    <div class="m-1 col col-4">
                        <div class="card">
                            <img src="${purchasedProduct.image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <p class="card-text">Name : ${purchasedProduct.name}</p>
                                    <p class="card-text">Price : ${purchasedProduct.price}</p>
                                    <p class="card-text">Quantity : ${purchasedProduct.quantity} </p>
                                    <p class="card-text"><button onclick="handleReturnProduct(${purchasedProduct.id})" class="btn btn-md w-100 btn-danger">Return</button></p>
                                </div>
                        </div>
                    </div>`
  })

        document
          .getElementById('purchasedProductsProgressBar')
          .classList.add('d-none')


        document.getElementById('purchasedProductsCards').innerHTML =
          purchasedProductListCards

}

/*
     ACTIONS FOR VENDIG MACHINE
*/
const handleBuyProduct = async (productId) => {
  const product = productList.find((product) => product.id === productId)

  await buyProduct(product)

  await fetchBalance()

  await fetchProducts()

  renderProducts()
}

const handleAddMoneyToWallet = async (rupees) => {
   document.getElementById('walletProgressBar').classList.remove('d-none')

  await addBalance(rupees)

  await fetchBalance()

  await fetchProducts()

  renderProducts()
}

const handleReturnProduct = async (purchasedProductId) => {
      document
        .getElementById('purchasedProductsProgressBar')
        .classList.remove('d-none')

  const purchasedProduct = purchasedProductList.find(
    (purchasedProduct) => Number(purchasedProduct.id) === purchasedProductId
  )
  await returnProduct(purchasedProduct)

  await fetchBalance()

  await fetchProducts()

  renderProducts()

   document
     .getElementById('purchasedProductsProgressBar')
     .classList.add('d-none')
}

/*
     APIS FOR VENDIG MACHINE
*/
const fetchProducts = async () => {
  await fetch(PRODUCTS_API)
    .then((res) => res.json())
    .then((response) => (productList = response))
    .catch((error) => {
       errorAlert(new Error(`${error.message}`))
    })
}

const fetchBalance = async () => {
  await fetch(BALANCE_API)
    .then((res) => res.json())
    .then((response) => (balance = response[0]))
    .catch((error) => {
     errorAlert(new Error(`${error.message}`))
    })
}

const fetchPurchasesProducts = async () => {
  await fetch(PURCHASED_PRODUCTS_API)
    .then((res) => res.json())
    .then((response) => (purchasedProductList = response))
    .catch((error) => {
       errorAlert(new Error(`${error.message}`))
    })
}

const addBalance = async (rupees) => {
  const existingBalanceResponse = await fetch(BALANCE_API)

  if (existingBalanceResponse.status === 200) {
    const exitsingBalance = await existingBalanceResponse.json()

    await fetch(`${BALANCE_API}/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: exitsingBalance[0].amount + rupees,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        renderBalance(response.amount)
        successAlert('Balance Added Successfully')
      })
      .catch((error) => {
        errorAlert(new Error(`${error.message}`))
      })
  } else {
       errorAlert(new Error(`'Could not add balance to the wallet`))
  }
}

const buyProduct = async (product) => {
  document
    .getElementById('purchasedProductsProgressBar')
    .classList.remove('d-none')

  await decrementBalance(product)

  await decrementProductQuantity(product)

  await fetchProducts()

  renderProducts()

  await fetch(PURCHASED_PRODUCTS_API, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(new PurchasedProduct(product)),
  })
    .then((res) => res.json())
      .then((response) => {
        
      successAlert('Product Bought Successfully')

      purchasedProductList.push(response)
      renderPurchasedProducts()
    })
    .catch((error) => {
      errorAlert(new Error(`${error.message}`))
    })
}

const returnProduct = async (purchasedProduct) => {
  await incrementBalance(purchasedProduct)

  await incrementProductQuantity(purchasedProduct)

  await fetchProducts()
  renderProducts()

  await fetch(`${PURCHASED_PRODUCTS_API}/${purchasedProduct.id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((res) => res.json())
    .then((response) => {
     
          successAlert(
            'Product Returned Successfully, amount shall be credited in your wallet'
          )

      purchasedProductList = filterProcuct(response)
      renderPurchasedProducts()
    })
      .catch((error) => {
         errorAlert(new Error(`${error.message}`))
    })
}

function filterProcuct(response) {
  let newPurchasedProductList = []

  purchasedProductList.map((purchasedProduct) => {
    if (Number(purchasedProduct.id) !== Number(response.id)) {
      newPurchasedProductList.push(purchasedProduct)
    }
  })
  return newPurchasedProductList
}

const decrementBalance = async (product) => {
  const existingBalanceResponse = await fetch(`${BALANCE_API}/1`)

  if (existingBalanceResponse.status === 200) {
    const existingBalance = await existingBalanceResponse.json()

    await fetch(`${BALANCE_API}/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(existingBalance.amount) - Number(product.price),
      }),
    })
      .then((res) => res.json())
      .then((response) => renderBalance(response.amount))
      .catch((error) => {
        errorAlert(new Error(`${error.message}`))
      })
  } else {
      errorAlert(new Error(`Unable to get balance from wallet`))
  }
}

const incrementBalance = async (purchasedProduct) => {
  const existingBalanceResponse = await fetch(`${BALANCE_API}/1`)

  if (existingBalanceResponse.status === 200) {
    const existingBalance = await existingBalanceResponse.json()

    await fetch(`${BALANCE_API}/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(existingBalance.amount) + Number(purchasedProduct.price),
      }),
    })
      .then((res) => res.json())
      .then((response) => renderBalance(response.amount))
      .catch((error) => {
        errorAlert(new Error(`${error.message}`))
      })
  } else {
       errorAlert(new Error(`Unable to get balance from wallet`))
  }
}

const decrementProductQuantity = async (product) => {
  const existingProductsResponse = await fetch(`${PRODUCTS_API}/${product.id}`)

  if (existingProductsResponse.status === 200) {
    const existingProducts = await existingProductsResponse.json()

    await fetch(`${PRODUCTS_API}/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        quantity: existingProducts.quantity - 1,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        productList.map((product) =>
          product.id === response.id ? response : product
        )
      })
      .catch((error) => {
        errorAlert(new Error(`${error.message}`))
      })
  } else {
        errorAlert(new Error(`Unable to deduct quantity of the product`))
  }
}

const incrementProductQuantity = async (purchasedProduct) => {
  const existingProductsResponse = await fetch(
    `${PRODUCTS_API}/${purchasedProduct.productId}`
  )

  if (existingProductsResponse.status === 200) {
    const existingProducts = await existingProductsResponse.json()

    await fetch(`${PRODUCTS_API}/${purchasedProduct.productId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        quantity: existingProducts.quantity + 1,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        productList.map((product) =>
          product.id === response.id ? response : product
        )
      })
      .catch((error) => {
          errorAlert(new Error(`${error.message}`))
      })
  } else {
        errorAlert(new Error(`Unable to deduct quantity of the product`))
  }
}

function successAlert(message) {
  setTimeout(() => {
       document.getElementById('alertDiv').innerHTML = null
  }, 2000)

    document.getElementById('alertDiv').innerHTML =
        `<div class="alert alert-success " role="alert">
           ${message}.
        </div>`;
}
function errorAlert(message) {
  setTimeout(() => {
    document.getElementById('alertDiv').innerHTML = null
  }, 2000)
    document.getElementById(
        'alertDiv'
    ).innerHTML = `<div class="alert alert-danger " role="alert">
           ${message}.
        </div>`;
}
