<template>
    <v-container>
       <Header/>
        <v-row>
            <!-- Navigacija za povratak natrag -->
            <v-breadcrumbs :items="breadCrumbs" divider=">"></v-breadcrumbs>
        </v-row>

        <v-row>
          <!-- Slika koja se prikazuje samo na md-and-up -->
          <v-col cols="12" md="6" xl="4" class="hidden-sm-and-down">
            <v-row>
              <zoom-on-hover :img-normal="product.url_slike"></zoom-on-hover>
            </v-row>
          </v-col>
          <!--  -->
          <!--******************************* Bitne info + actions *******************************-->
          <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <span class="text-caption">{{ product.kategorija }}</span>
                <h1 class="text-h4 font-weight-light primary--text">{{ product.ime }}</h1>
                <span class="text-subtitle-1">SKU: N/A</span><br>
                <span class="text-h5 font-weight-bold">{{ product.cijena }} KM</span><br><br>

                <!-- controls START -->
                <div class="no-print">
                  <!-- Quantity counter -->
                  <span class="text-button">Količina:</span>
                  <v-text-field min="1" max="100" value="1" default="1" v-model="quantityCounter" type="number" outlined shaped single-line hide-details></v-text-field>
                  <!---------------------->
                  <v-btn class="mt-2 mb-16" color="primary" @click="addToCart({ id: product.id, quantity: quantityCounter })" >Dodaj u košaricu</v-btn>
                  <div class="mb-3">
                    <v-icon class="mx-1" @click="shareOnFacebook">mdi-facebook</v-icon>
                    <v-icon class="mx-1" @click="shareOnWhatsApp">mdi-whatsapp</v-icon>
                    <v-icon class="mx-1" @click="print">mdi-printer</v-icon>
                    <v-icon class="mx-1" @click="shareViaEmail">mdi-email</v-icon>
                  </div>
                </div>
                <!-- controls END -->

              </v-col>
            <!-- Slika koja se prikazuje samo na sm-and-down -->
            </v-row>
             <v-row class="hidden-md-and-up no-print">
              <zoom-on-hover :img-normal="product.url_slike"></zoom-on-hover>
            </v-row>
            <!-- Opis proizvoda -->
            <v-row>
              <v-col order="-1">
                <hr>
                <h2 class="text-overline">Opis proizvoda</h2>
                <div class="text-body-1" v-html="product.opis"></div>
              </v-col>
            </v-row>
          </v-col>
          <!--************************************************************************************-->
        </v-row>
    </v-container>
</template>

<script>
import Header from "@/components/layout/TheHeader";
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import store from "@/store";
import Vue from 'vue'
import ZoomOnHover from "vue-zoom-on-hover";
Vue.use(ZoomOnHover);


export default {
    name: "productView",
    components: { Header },
    props: {
      slug: {
        type: String,
        required: true
      }
    },
    beforeRouteEnter(to, from, next) {
      store.dispatch('product/fetchProduct', to.params.id, {root: true})
      next()
    },
    computed: {
      breadCrumbs() {
        const items = [
          {
            text: 'Naslovna',
            disabled: false,
            href: '/',
          },
          {
            text: 'Trgovina',
            disabled: false,
            href: '/trgovina',
          },
          {
            text: this.product.ime,
            disabled: true,
            href: '',
          },
        ]
        return items
      },
      shareOnWAppText() {
        const text = this.product.ime + ' ' + window.location.href
        const uriEncodedText = encodeURI(text)
        return uriEncodedText
      },
      socialShareText() {
        const text = 'Pogledaj ovo na Dash Detailing-u, moglo bi te zanimati: '+ this.product.ime + '.' + '%0D%0A' + window.location.href
        return text
      },

      ...mapGetters('product', ['product'])
    },
    data: () => ({
      // mock
      // product:  {'id':'1', 'slug':'sonax-pasta', 'name':"SONAX pasta za poliranje", 'brand':'Sonax', 'kategorija': 'Pribor i alati za poliranje', 'price': '55.90', 'imgLink': 'https://www.carbox.ba/wp-content/uploads/2019/02/296141-SONAX-Politura-sa-voskom-crna.jpg'},
    
      quantityCounter: 1,
    }),
    methods: {
    // dodavanje u košaricu
    ...mapActions('cart', ['addToCart']),
      shareOnFacebook ()
      {
        const url = "https://www.facebook.com/sharer.php?u=" + window.location.href
        window.open(url, "_blank", "resizable=yes,width=500,height=500")
      },
      shareOnWhatsApp()
      {
        const url = "https://wa.me/?text=" + this.shareOnWAppText
        window.open(url, "_blank", "resizable=yes,width=500,height=500")
      },
      // ispis  
      print()
      {
        window.print();
      },
      shareViaEmail()
      {
        const mailSubject = 'DashDETAILING - ' +  this.product.ime
        const url = "mailto:?subject=" + mailSubject + "&body=" + this.socialShareText
        window.open(url, "_blank", "resizable=yes,width=500,height=500")
      }
    }
}
</script>

<style lang="css">
  @media print
{
.no-print {display:none;}
}
</style>