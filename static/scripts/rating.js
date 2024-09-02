Vue.component('starRating', {
  props: ['ratingTitle', 'ratingMessage', 'starText'],
  data: () => {
    return {
      rating: 0,
      ratingSelected: false
    };
  },
  methods: {
    changeRating: function (val) {
      this.rating = val;
      this.ratingSelected = true;

      // Set the title and message based on the selected rating
      this.$emit('update:ratingTitle', `Thank you!`);
      this.$emit('update:ratingMessage', `You rated this project ${val} ${this.starText}.`);
    }
  },
  template: '#tpl_star_rating'
});

var app = new Vue({
  el: '#rate',
  data: {
    ratingTitle: 'Rate this project', // Initial message
    ratingMessage: 'Please select a star to rate.', // Initial message
    starText: 'star/s'
  }
});
