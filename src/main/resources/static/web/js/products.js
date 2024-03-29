const app = Vue.createApp({
  data() {
      return {
          products: [],
          productsBackUp: [],
          typeCategory: [],
          categorySofa: [],
          productsSofaBackup: [],
          categoryStorage: [],
          productsStorageBackup: [],
          categoryTable: [],
          productsTableBackup: [],
          categoryGarden:[],
          productsGardenBackup: [],
          materialTypeCategory: [],
          typeVModel: [],
          materialTypeVModel: [],
          inputSearchVModel: "",
          priceVModel: "",
          firstFilter: [],
          shoppingCart: [],
          totalAmount: 0,


          productsIndex:[],

          materialTypeSofa: [],


          hola: "hola",
            
          emailVModel: "",
          passwordVModel: "",
          
          firstNameRegisterVModel: "",
          lastNameRegisterVModel: "",
          emailRegisterVModel: "",
          passwordRegisterVModel: "",
          celPhoneRegisterVModel: null,
          
          login:false,
          register:false,

          clientCurrent: null,
            clientPage: "./client-profile.html",
            mailCurrent: true,

      }
  },
  created() {
      this.loadProducts()
    this.loadClientCurrent()
  },
  mounted() {

      let currentCart = JSON.parse(localStorage.getItem('cart'))
      if(!currentCart) {
          this.shoppingCart = []
      } else {
          this.shoppingCart = currentCart
      }

      let currentTotalAmount = JSON.parse(localStorage.getItem('totalAmount'))
      if(currentTotalAmount != 0){
          this.totalAmount = currentTotalAmount
      }
  },
  methods: {
      loadProducts() {
          axios.get('/api/products')
              .then(response => {
                  this.products = response.data.filter(data => data.enable)
                  this.productsBackUp = this.products
                  this.products.forEach(product => !this.typeCategory.includes(product.type) ? this.typeCategory.push(product.type) : "")
                  this.products.forEach(product => !this.materialTypeCategory.includes(product.materialType) ? this.materialTypeCategory.push(product.materialType) : "")

                  this.products.forEach(product => product.type == "sofa" ? this.categorySofa.push(product): "" )
                  this.products.forEach(product => product.type == "storage" ? this.categoryStorage.push(product): "" )
                  this.products.forEach(product => product.type == "table" ? this.categoryTable.push(product): "" )
                  this.products.forEach(product => product.type == "garden" ? this.categoryGarden.push(product): "" )

                  this.categorySofa.forEach( product => !this.materialTypeSofa.includes(product.materialType) ? this.materialTypeSofa.push(product.materialType) : "" )
                  console.log(this.products);

                  this.productsSofaBackup = this.categorySofa
                  this.productsStorageBackup = this.categoryStorage
                  this.productsGardenBackup = this.categoryGarden
                  this.productsTableBackup = this.categoryTable

                //   console.log(this.products)





              })
              .catch(error => console.log(error))
      },
      loadClientCurrent(){
        axios.get('/api/clientcurrent')
        .then(response => {
            console.log(response)
            this.clientCurrent = response.data
            if(this.clientCurrent.email.includes("@admin")){
                this.mailCurrent = false
                this.clientPage = "./admin/admin2.html"
            }
            console.log(this.mailCurrent)
        })
        .catch(error => console.log(error))
    },
    // finalAmount() {
    //       this.totalAmount = 0
    //       this.shoppingCart.map(product => {
    //           let addition = product.quantity * product.price
    //           this.totalAmount += addition
    //       })
    //       localStorage.setItem('totalAmount', JSON.stringify(this.totalAmount))
    // },
    // cartStorage(){
    //       localStorage.setItem('cart', JSON.stringify(this.shoppingCart))
    //       this.finalAmount()
    // },
    // addProductToShoppingCart(selectProduct){

    //           let repeatedProduct = this.shoppingCart.filter(product => product.id == selectProduct.id)

    //           if (repeatedProduct.length > 0) {
    //               // CASO EN EL QUE ESTA EL ELEMENTO YA EN EL CARRITO
    //               this.shoppingCart.filter(item => {
    //                   if (item.id == selectProduct.id) {
    //                       if (item.stock > 0) {
    //                           item.quantity++
    //                           item.stock--
    //                       }
    //                   }
    //               })
    //               this.cartStorage()
    //           }
    //           else {
    //               // CASO EN EL QUE NO ESTA
    //               this.productsBackUp.filter(product => {
    //                   if (product.id == selectProduct.id) {
    //                         selectProduct.quantity++
    //                           product.stock--
    //                   }
    //               })
    //               this.shoppingCart.push(selectProduct)
    //               this.cartStorage()
    //           }

    //           //localStorage.setItem('totalAmount', JSON.stringify(this.totalAmount))
    // },
    // deleteOneItem(selectProduct){
    //       if(selectProduct.quantity > 0){
    //           this.shoppingCart.filter(product => {
    //               if(product.id == selectProduct.id){
    //                   product.quantity--
    //                   product.stock++
    //               }
    //           })
    //       }
    //       this.cartStorage()
    // },
    // deleteProduct(selectProduct){
    //       this.shoppingCart = this.shoppingCart.filter(product => product != selectProduct)
    //       this.cartStorage()
    // },
    // emptyCart() {
    //       localStorage.clear()
    //       window.location.reload()
    // },

    access() {
        axios.post('/api/login', `email=${this.emailVModel}&password=${this.passwordVModel}`)
            .then(response => {
                console.log(response)
                console.log(this.emailVModel)
                if(this.emailVModel.includes("@admin")){
                    window.location.assign("./admin/admin2.html")
                } else {
                    Swal.fire({
                        title: `¡Welcome!`,
                        confirmButtonColor: 'lightgray',
                        timer: 1500
                    })
                    .then(() => window.location.reload())
                }
            })
            .catch(function(error) {
                Swal.fire({
                    title: 'Wrong Password or UserMail Check Again',
                    confirmButtonColor: 'lightgray',
                    confirmButtonText: 'Try again',
                    timer: 2500

                })
            })
    },
    clientRegister() {
        if (!this.emailVModel.includes("@")) {
            Swal.fire({
                text: `The email Must Contain @ to be valid`,
                confirmButtonColor: 'lightgray',
                timer: 5500
            })
        } else {

        axios.post('/api/clients', `firstName=${this.firstNameRegisterVModel}&lastName=${this.lastNameRegisterVModel}&email=${this.emailVModel}&password=${this.passwordVModel}&cellphone=${this.celPhoneRegisterVModel}&city=${this.cityVModel}&addres=${this.addresVModel}&state=${this.stateVModel}`)
            .then(response => {


                axios.post('/api/sendemailvalidation', "contactTo=" + this.emailVModel);


                Swal.fire({
                    title: 'Write the secret word sended to your email',
                    input: 'text',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            if (value === 'chair') {
                                Swal.fire(
                                        'Successful registration!',
                                        'Welcome!',
                                        'success'
                                    )
                                    .then(() => {

                                        this.access()

                                    })
                            } else {
                                /* resolve(); */
                                this.deleteClient(this.emailVModel);
                            }
                        })
                    }
                })


            })

        .catch(function(error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: "Missing information",
                confirmButtonColor: 'lightgray',
                confirmButtonText: 'Ok',

            })
        })
    }
    },



    // access() {
    //     axios.post('/api/login', `email=${this.emailVModel}&password=${this.passwordVModel}`)
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error))
    // },
    // clientRegister() {
    //     axios.post('/api/clients', `firstName=${this.firstNameRegisterVModel}&lastName=${this.lastNameRegisterVModel}&email=${this.emailRegisterVModel}&password=${this.passwordRegisterVModel}&cellphone=${this.celPhoneRegisterVModel}`)
    //     .then(response => console.log(response))
    //     .catch(error => console.log(error))
    // },

    theLoginAndRegister(){
        if(this.register == false ){
            this.login  = false
            this.register =  true;
        }
        else{
            this.login = true;
            this.register = false;
        }
    },
    accounts(){
        if (this.register == false) {
            this.login = !this.login;
            this.register = false;
        } else {
            this.login == false;
            this.register = false;
        }
    },
    closeTools(){
        this.login = false;
        this.register = false;
    },
    // buttonChecked(){

    //     if(this.priceVModel == "lower"){
    //         document.getElementById("lower").classList.add("checked");
    //         document.getElementById("lowermob").classList.remove("checked");
    //         document.getElementById("higher").classList.remove("checked");
    //         document.getElementById("highermob").classList.remove("checked");

            
    //     }
        
    //     if(this.priceVModel == "higher"){
    //         document.getElementById("higher").classList.add("checked");
    //         document.getElementById("highermob").classList.remove("checked");
    //         document.getElementById("lower").classList.remove("checked");
    //         document.getElementById("lowermob").classList.remove("checked");
    //     }
   
    // },
    
    balanceFormateado(numero){
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'ARS' }).format(numero)
    },

  },

  computed: {
      filter() {
          let firstFilter = this.productsBackUp.filter(product => product.name.toLowerCase().includes(this.inputSearchVModel.toLowerCase()))
          if (this.typeVModel.length && !this.materialTypeVModel.length) {
              this.products = firstFilter.filter(product => this.typeVModel.includes(product.type))
          }
          else if (this.materialTypeVModel.length && !this.typeVModel.length) {
              this.products = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType))
          }
          else if(this.typeVModel.length && this.materialTypeVModel.length){
              this.products = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType)).filter(product => this.typeVModel.includes(product.type))
          }
          else {
              this.products = firstFilter
          }

      },
      filterSofa(){
        let firstFilter = this.productsSofaBackup.filter(product => product.name.toLowerCase().includes(this.inputSearchVModel.toLowerCase()))
        if (this.typeVModel.length && !this.materialTypeVModel.length) {
            this.categorySofa = firstFilter.filter(product => this.typeVModel.includes(product.type))
        }
        else if (this.materialTypeVModel.length && !this.typeVModel.length) {
            this.categorySofa = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType))
        }
        else if(this.typeVModel.length && this.materialTypeVModel.length){
            this.categorySofa = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType)).filter(product => this.typeVModel.includes(product.type))
        }
        else {
            this.categorySofa = firstFilter
        }

      },
      filterStorage(){
        let firstFilter = this.productsStorageBackup.filter(product => product.name.toLowerCase().includes(this.inputSearchVModel.toLowerCase()))
        if (this.typeVModel.length && !this.materialTypeVModel.length) {
            this.categoryStorage = firstFilter.filter(product => this.typeVModel.includes(product.type))
        }
        else if (this.materialTypeVModel.length && !this.typeVModel.length) {
            this.categoryStorage = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType))
        }
        else if(this.typeVModel.length && this.materialTypeVModel.length){
            this.categoryStorage = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType)).filter(product => this.typeVModel.includes(product.type))
        }
        else {
            this.categoryStorage = firstFilter
        }

      },
      filterTable(){
        let firstFilter = this.productsTableBackup.filter(product => product.name.toLowerCase().includes(this.inputSearchVModel.toLowerCase()))
        if (this.typeVModel.length && !this.materialTypeVModel.length) {
            this.categoryTable = firstFilter.filter(product => this.typeVModel.includes(product.type))
        }
        else if (this.materialTypeVModel.length && !this.typeVModel.length) {
            this.categoryTable = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType))
        }
        else if(this.typeVModel.length && this.materialTypeVModel.length){
            this.categoryTable = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType)).filter(product => this.typeVModel.includes(product.type))
        }
        else {
            this.categoryTable = firstFilter
        }
      },
      filterGarden(){
        let firstFilter = this.productsGardenBackup.filter(product => product.name.toLowerCase().includes(this.inputSearchVModel.toLowerCase()))
        if (this.typeVModel.length && !this.materialTypeVModel.length) {
            this.categoryGarden = firstFilter.filter(product => this.typeVModel.includes(product.type))
        }
        else if (this.materialTypeVModel.length && !this.typeVModel.length) {
            this.categoryGarden = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType))
        }
        else if(this.typeVModel.length && this.materialTypeVModel.length){
            this.categoryGarden = firstFilter.filter(product => this.materialTypeVModel.includes(product.materialType)).filter(product => this.typeVModel.includes(product.type))
        }
        else {
            this.categoryGarden = firstFilter
        }
      },
      priceFilter (){
          if(this.priceVModel == "higher"){
          this.products = this.productsBackUp.sort((a,b) => { if(a.price > b.price) {return -1} if(a.price < b.price) {return 1}})
          }
          else if(this.priceVModel == "lower"){
              this.products = this.productsBackUp.sort((a,b) => { if(a.price > b.price) {return 1} if(a.price < b.price) {return -1}})
          }
      },
      priceFilterSofa(){
        if(this.priceVModel == "higher"){
            this.categorySofa = this.productsSofaBackup.sort((a,b) => { if(a.price > b.price) {return -1} if(a.price < b.price) {return 1}})
            }
        else if(this.priceVModel == "lower"){
                this.categorySofa = this.productsSofaBackup.sort((a,b) => { if(a.price > b.price) {return 1} if(a.price < b.price) {return -1}})
        }
      },
      priceFilterStorage(){
        if(this.priceVModel == "higher"){
            this.categoryStorage = this.productsStorageBackup.sort((a,b) => { if(a.price > b.price) {return -1} if(a.price < b.price) {return 1}})
            }
        else if(this.priceVModel == "lower"){
                this.categoryStorage = this.productsStorageBackup.sort((a,b) => { if(a.price > b.price) {return 1} if(a.price < b.price) {return -1}})
        }
      },
      priceFilterTable(){
        if(this.priceVModel == "higher"){
            this.categoryTable = this.productsTableBackup.sort((a,b) => { if(a.price > b.price) {return -1} if(a.price < b.price) {return 1}})
            }
        else if(this.priceVModel == "lower"){
                this.categoryTable = this.productsTableBackup.sort((a,b) => { if(a.price > b.price) {return 1} if(a.price < b.price) {return -1}})
        }
      },
      priceFilterGarden(){
        if(this.priceVModel == "higher"){
            this.categoryGarden = this.productsGardenBackup.sort((a,b) => { if(a.price > b.price) {return -1} if(a.price < b.price) {return 1}})
            }
        else if(this.priceVModel == "lower"){
                this.categoryGarden = this.productsGardenBackup.sort((a,b) => { if(a.price > b.price) {return 1} if(a.price < b.price) {return -1}})
        }
      }

  }
}).mount('#app')