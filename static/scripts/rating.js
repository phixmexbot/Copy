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
      console.log('changeRating method called');
      console.log('Initial rating:', this.rating);
      console.log('Initial ratingSelected:', this.ratingSelected);
      console.log('Value passed to changeRating:', val);

      if (this.rating === 0) {
        this.rating = val;
        this.ratingSelected = true;
        console.log('Rating set to:', this.rating);
        console.log('Rating selected:', this.ratingSelected);
      } else {
        console.log('Rating was already set, no changes made.');
      }

      console.log('Current ratingTitle:', this.ratingTitle);
      console.log('Current ratingMessage:', this.ratingMessage);
      console.log('Current starText:', this.starText);
    }
  },
  template: '#tpl_star_rating'
});

var app = new Vue({
  el: '#rate',
  data: {
    ratingTitle: 'Thank you!',
    ratingMessage: 'You rated this project:',
    starText: 'star/s'
  },
  created() {
    console.log('Vue instance created with data:', this.$data);
  },
  mounted() {
    console.log('Vue instance mounted.');
    console.log('Initial ratingTitle:', this.ratingTitle);
    console.log('Initial ratingMessage:', this.ratingMessage);
    console.log('Initial starText:', this.starText);
  }
});
