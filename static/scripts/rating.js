Vue.component('starRating', {
  props: ['ratingTitle', 'ratingMessage', 'starText'],
  data: () => {
    return {
      rating: 0,
      ratingSelected: false };

  },
  methods: {
    changeRating: function (val) {
      if (this.rating === 0) {
        this.rating = val;
        this.ratingSelected = true;
      }
    } },

  template: '#tpl_star_rating' });

var app = new Vue({
  el: '#app',
  data: {
    ratingTitle: 'Thank you!',
    ratingMessage: 'You rated this project:',
    starText: 'star/s' } });
