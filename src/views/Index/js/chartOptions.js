export const getOptions = (data) => {
  let options = {
    series: [
      {
        name: 'series1',
        data
      }
    ],
    chart: {
      type: 'area',
      height: '100%',
      parentHeightOffset: 0,
      offsetX: 0,
      offsetY: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: { enabled: true }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      show: false,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#1A996E'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    colors: ['#1A996E']
  }
  return options
}
