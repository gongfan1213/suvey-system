<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">在线调查系统 Online Survey System</a>
      </div>
    </nav>
    
    <div class="container">
      <router-view />
    </div>
    
    <footer class="mt-5 py-3 text-center bg-light">
      <p>COMP7270/COMP7980 - Web和移动编程 Web and Mobile Programming - HKBU - 2025春季 Spring 2025</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
</style>