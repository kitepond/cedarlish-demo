/* Pricing data. SAMPLE DATA - edit freely. */
window.CEDARLISH_DATA = window.CEDARLISH_DATA || {};
window.CEDARLISH_DATA.pricing = {
  "plans": [
    {
      "id": "term",
      "months": 3,
      "discount": 0
    },
    {
      "id": "annual",
      "months": 12,
      "discount": 0.08
    }
  ],
  "defaultPlan": "term",
  "rounding": {
    "USD": 1,
    "VND": 10000
  },
  "enrolment": {
    "USD": 30,
    "VND": 750000
  },
  "items": {
    "seedling": {
      "monthly": {
        "USD": 78,
        "VND": 1980000
      },
      "sessionsPerMonth": 8,
      "classSize": 8,
      "perWeek": 2,
      "classMinutes": 60
    },
    "sapling": {
      "monthly": {
        "USD": 92,
        "VND": 2350000
      },
      "sessionsPerMonth": 8,
      "classSize": 8,
      "perWeek": 2,
      "classMinutes": 75
    },
    "branch": {
      "monthly": {
        "USD": 108,
        "VND": 2750000
      },
      "sessionsPerMonth": 8,
      "classSize": 10,
      "perWeek": 2,
      "classMinutes": 90
    },
    "canopy": {
      "monthly": {
        "USD": 118,
        "VND": 3000000
      },
      "sessionsPerMonth": 8,
      "classSize": 10,
      "perWeek": 2,
      "classMinutes": 90
    },
    "crown": {
      "monthly": {
        "USD": 128,
        "VND": 3250000
      },
      "sessionsPerMonth": 8,
      "classSize": 10,
      "perWeek": 2,
      "classMinutes": 90
    }
  }
};
