<template>
    <div class="pa-2" :class="{'pa-0':$vuetify.breakpoint.xs, 'px-8':$vuetify.breakpoint.sm,'px-10':$vuetify.breakpoint.md, 'px-16':$vuetify.breakpoint.lgAndUp}">
    <Header />
    <SearchBar />
    <PromoBanner />
    <Page />
    </div>
</template>

<script>
import Header from "@/components/layout/TheHeader";
import SearchBar from "@/components/shop/TheSearchBar"
import PromoBanner from "@/components/shop/PromoBanner"
import Page from "@/components/shop/productsPage/TheProductsPage"
import store from "@/store";

export default {
    name: "shopHome",
    components: { Header, SearchBar, PromoBanner, Page },
    data: () => ({

    }),
     beforeRouteEnter(to, from, next) {
      store.dispatch('products/fetchProducts', {categoryId: to.params.id}, {root: true})
      next()
    },
     beforeRouteUpdate(to, from, next) {
      store.dispatch('products/fetchProducts', {categoryId: to.params.id}, {root: true})
      next()
    },
}
</script>

<style scoped>

</style>
