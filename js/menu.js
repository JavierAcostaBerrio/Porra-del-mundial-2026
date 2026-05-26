<script>
document.querySelectorAll('.menu a').forEach(link => {
  const linkPage = link.getAttribute('href');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});
</script>
