import { capitalize, useMediaQuery, useTheme } from '@mui/material';
import { LayoutPosition, scales } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { ExerciseType } from '../interfaces';
import { DataTypeEnum, IBodyGroupProgressRaw, TypeOfStatProgress } from '../interfaces/stats';
import { statsConverter } from '../utils';

interface dataParams {
  data: number[],
  labels: string[],
  chartType: "doughnut" | "area" | "bar";
  title: string,
  position: LayoutPosition;
}

const bgArray =
  [
    'rgba(252, 147, 68, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 229, 204, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(229, 255, 204, 0.2)',
    'rgba(122, 104, 86, 0.2)',
    'rgba(195, 155, 209, 0.2)',
  ];

export const defaultData = {
  labels: ['Harry Popoter'],
  datasets: [
    {
      label: 'Time',
      data: [12, 19, 3, 5, 2, 3],
      fill: true,
      backgroundColor: '#fc9344',
      hoverBackgroundColor: [
        'rgba(252, 147, 68, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(229, 255, 204, 1)',
        'rgba(122, 104, 86, 1)',
        'rgba(195, 155, 209, 1)',
      ],
      borderColor: [
        'rgba(252, 147, 68, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(229, 255, 204, 1)',
        'rgba(122, 104, 86, 1)',
        'rgba(195, 155, 209, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const defaultOptions = {
  aspectRatio: 2,
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: {
      display: false,
    },
    paddingBelowLegends: true,

    legend: {
      labels: {
        padding: 5
      },
      position: "right" as LayoutPosition,
      display: true,
    },
    tooltip: {
      callbacks: {
        label: () => { }
      }
    }
  },

  elements: {
    line: {
      capBezierPoints: true,
      cubicInterpolationMode: 'monotone' as 'default' | 'monotone',
    }
  },

  scales: {
    y: {
      ticks: {
        callback: (label: any) => label,
        backdropPadding: 0,
        padding: 0,
        display: true,
      },
    },
  }
};

export const useSetChart = (
  dataList: any[],
  labels: string[],
  chartType: "doughnut" | "area" | "bar",
  title: string,
  position: LayoutPosition,
  displayLegend: boolean,
  dataType: DataTypeEnum,
  typeOfStat?: TypeOfStatProgress
) => {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState(defaultData);
  const [options, setOptions] = useState(defaultOptions);
  useEffect(() => {
    setChartOptions();
    setChartData();
  }, [dataList, position]);

  const setChartData = () => {
    const newDataList = chartType === "bar" ? getBarDataList() : getDataList();
    const backgroundColor = chartType !== 'doughnut' ? '#fc9344' : bgArray;
    const newDataset = { ...defaultData.datasets[0], backgroundColor, label: title, data: newDataList };

    const barDatasets: any[] = chartType === "bar" ? newDataList.map((data, index) => {
      return {
        ...defaultData.datasets[0],
        data,
        label: capitalize(dataList[index].bodyGroup),
        backgroundColor: bgArray[index],
        borderColor: defaultData.datasets[0].borderColor[index],
        hoverBackgroundColor: defaultData.datasets[0].hoverBackgroundColor[index],
      };
    }) : [];

    let datasets: any[] = [];
    barDatasets.length > 0 ? (datasets = barDatasets) : datasets.push(newDataset);

    const formattedLabels = labels[0]?.includes("Week") || chartType === "doughnut" ? labels.map(label => capitalize(label)) : labels.map(newLabel => newLabel);

    setData({ ...defaultData, labels: formattedLabels, datasets });
  };

  const setChartOptions = () => {
    const legend = { ...defaultOptions.plugins.legend, position, display: displayLegend };
    const tooltip: any = {
      ...defaultOptions.plugins.tooltip,
      callbacks: {
        title: (title: any) => {
          if (chartType === "bar") {
            return title[0].dataset.label;
          } else {
            console.log(title);

            
            return `${statsConverter.formatLabelToStats(title[0].label, labels)}`;
          }
        },
        label: (label: any) => `${title}: ${statsConverter.formatDataToStats(label.formattedValue, label, dataType)}`
      }
    };
    let padding = 0;
    if (chartType === "doughnut") {
      if (mediaQuery) padding = -100; else padding = -30;
    }
    
    const plugins = { ...defaultOptions.plugins, legend, tooltip };
    const scales = {
      ...defaultOptions.scales,
      y: {
        ticks: {
          ...defaultOptions.scales.y.ticks,
          padding,
          callback: (label: number) => chartType !== "doughnut" ? `${statsConverter.formatYAxisToStats(label, dataType)}` : ''
        }
      }
    };
    setOptions({ ...defaultOptions, plugins, scales });
  };

  const getDataList = (): number[] => {
    if (!typeOfStat) {
      if (chartType === "doughnut" && dataType === DataTypeEnum.TIME) {
        return statsConverter.formatTimeToTime(dataList);
      }
      return dataList;
    } else {
      switch (typeOfStat) {
        case TypeOfStatProgress.DURATION:
          return dataList.map(data => data.duration);
        case TypeOfStatProgress.CARDIO:
          return dataList.map(data => data.cardio);
        default:
          return dataList.map(data => data.weight / data.numOfWorkouts);
      }
    }
  };

  const getBarDataList = (): number[][] => {
    let dataSets: number[][] = [];
    dataList.forEach(item => {
      if (item.type !== ExerciseType.CARDIO_TYPE) {

        let itemData: number[] = [];
        item.data.forEach((data: IBodyGroupProgressRaw) => {
          if (data.type === ExerciseType.CARDIO_TYPE) {
            itemData.push(0);
          } else {
            itemData.push(data.weight!);
          }
        });
        dataSets.push(itemData);
      }
    });
    return dataSets;
  };

  return {
    data,
    options,

    // Methods
    setChartData,
    setChartOptions
  };
};
