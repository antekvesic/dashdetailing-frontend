<template>
    <v-container>
        <v-row v-if="isLoading" class="pt-10" dense> 
            <h4 class="text-overline">Učitavanje proizvoda...</h4>
        </v-row>
        <v-row v-else-if="products.length === 0 || products==='Nema proizvoda koji odgovaraju vašem filteru.'" class="pt-10" dense> 
            <h4 class="text-overline">Nažalost, ovdje trenutno nema proizvoda.</h4>
        </v-row>   
        <v-row v-else>
            <v-container>
               <h4 class="text-overline">Broj prikazanih proizvoda: {{ products.length }}.</h4>
                <v-row>
                    <ProductPreview 
                        v-for="product in products"
                        :product=product
                        :key="product.id"
                    /> 
                </v-row> 
            </v-container>
            
            <v-row>
                <v-col cols="12"> 
                    <v-pagination
                    :length="1"
                    disabled
                    ></v-pagination>
                </v-col>
            </v-row>

        </v-row>

    </v-container>
</template>

<script>
import { mapGetters } from "vuex"
import ProductPreview from "@/components/shop/productsPage/VProductPreview"


export default {
    name: "ProductGrid",
    components: { ProductPreview },
    data: () => ({
       
    }),
    props: {
        products: {
            type: [ Array, String ],
            required: true
        }
    },
   computed: {

        ...mapGetters('products', ['isLoading'])
   }
}
</script>

<style scoped>

</style>