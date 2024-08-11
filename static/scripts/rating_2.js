Vue.component('starRating', {
  props: ['ratingTitle', 'ratingMessage', 'starText'],
  data: () => {
    return {
      rating: 0,
      ratingSelected: false };

  },
  methods: {
    // HACK: Arrow function is not working well here,
    //       while trying to access the variable in 'data'.
    changeRating: function (val) {
      // If rating is already selected,
      // you can't change it anymore.
      if (this.rating === 0) {
        this.rating = val;
        this.ratingSelected = true;
      }
    } },

  template: '#tpl_star_rating' });

var app = new Vue({
  el: '#rate',
  data: {
    ratingTitle: 'Thank you!',
    ratingMessage: 'You rated this project:',
    starText: 'star/s' } });
