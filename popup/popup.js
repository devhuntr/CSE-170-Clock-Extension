document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;

      tabs.forEach(btn => btn.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
});