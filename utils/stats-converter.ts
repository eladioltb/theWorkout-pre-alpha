import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import duration from "dayjs/plugin/duration";
import month from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { timeFormat } from ".";
import { DataTypeEnum, DefaulTimeEnum, IBodyGroupProgress, IBodyGroupProgressFiltered, IBodyGroupProgressRaw, ICalendarWorkout, IDataToChart, IFormattedExercises, IProgressInPeriod, IStatCardioExercise, IStatWeightExercise, IStatWorkout, IStatWorkoutExercise, IWorkoutTime } from "../interfaces/stats";
import { ExerciseType, ISerieCompleted, ITimeSerie, IWorkoutExercise } from "../interfaces";
import { _capitalize } from "chart.js/dist/helpers/helpers.core";
import { capitalize } from "@mui/material";

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

const monday = dayjs().weekday(1);
const sunday = dayjs().weekday(7);

interface bodyGroupWork {
  name: string,
  completed: number,
  date?: number;
}
interface date {
  startDate: number,
  endDate: number;
}

//Get calendar workout
export const getCalendarWorkout = (workoutList: IStatWorkout[]): ICalendarWorkout[] => {
  const calendarWorkoutList: ICalendarWorkout[] = [];

  workoutList.forEach((workout: IStatWorkout) => {
    const weightExercises = getMostUsedExercises([workout]);
    let totalWeight = 0;
    let totalReps = 0;
    if(weightExercises.weightFormattedExercises) {
      
      weightExercises.weightFormattedExercises.forEach(exercise => {
        
        totalWeight = totalWeight+exercise.totalWeight;
        totalReps = totalReps+exercise.reps;
      })
    }
    
    const name = workout?.routine?.name || '';
    const _id = workout._id;
    const img = '';
    const duration = workout.duration;
    const startDate = workout.startDate;
    const endDate = workout.endDate;
    const percentage = workout.percentage;
    const cardioTime = workout.cardioTime;
    const weightAverage = totalWeight/totalReps || 0;
    const routine = workout?.routine?._id as string;
    const bodyGroups = workout?.routine?.bodyGroups?.map(bodyGroup => bodyGroup.name as string) || [];

    calendarWorkoutList.push({
      name,
      _id,
      img,
      duration,
      startDate,
      endDate,
      percentage,
      cardioTime,
      weightAverage,
      routine,
      bodyGroups,
    })
  })
  
  return calendarWorkoutList;
}

// Get WorkoutTimeProgress
export const getProgressInPeriod = (workoutList: IStatWorkout[], defaultTime?: DefaulTimeEnum, date?: date): IProgressInPeriod => {
  const sortedWorkouts = workoutList.length > 0 ? workoutList.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? 1 : 0)) : [];
  const empty: IWorkoutTime = {
    cardio: 0,
    weight: 0,
    date: 0,
    duration: 0,
    numOfWorkouts: 0,
  };

  const time = defaultTime ? defaultTime : setLabelsCustom(date?.startDate, date?.endDate).time;
  const filteredWorkouts = filterWorkoutTiming(sortedWorkouts, time);
  const startDate = sortedWorkouts[0]?.startDate || 0;
  let labels: string[] = defaultTime ? setTimeLabels(time, startDate) : setLabelsCustom(date?.startDate, date?.endDate).labels;

  let basicData: IWorkoutTime[] = [];

  if (filteredWorkouts.length > 0) {

    switch (time) {
      case DefaulTimeEnum.MORE:
        labels.forEach((label, index) => {
          let hasAdded = false;
          filteredWorkouts.forEach(workout => {
            if (index === dayjs(workout.date).get('month')) {
              if (basicData[basicData.length - 1] && index === dayjs(basicData[basicData.length - 1].date).get('year')) {
                basicData[basicData.length - 1] = {
                  ...basicData[basicData.length - 1],
                  cardio: basicData[basicData.length - 1].cardio + workout.cardio,
                  weight: basicData[basicData.length - 1].weight + workout.weight,
                  duration: basicData[basicData.length - 1].duration + workout.duration,
                  numOfWorkouts: basicData[basicData.length - 1].numOfWorkouts! + 1
                };
              } else {
                basicData.push({ ...workout, numOfWorkouts: 1 });
              }
              hasAdded = true;
            }
          });

          if (!hasAdded) {
            basicData.push(empty);
          }
        });
        break;
      case DefaulTimeEnum.YEAR:
        labels.forEach((label, index) => {
          let hasAdded = false;
          filteredWorkouts.forEach(workout => {
            if (index === dayjs(workout.date).get('month')) {
              if (basicData[basicData.length - 1] && index === dayjs(basicData[basicData.length - 1].date).get('month')) {
                basicData[basicData.length - 1] = {
                  ...basicData[basicData.length - 1],
                  cardio: basicData[basicData.length - 1].cardio + workout.cardio,
                  weight: basicData[basicData.length - 1].weight + workout.weight,
                  duration: basicData[basicData.length - 1].duration + workout.duration,
                  numOfWorkouts: basicData[basicData.length - 1].numOfWorkouts! + 1
                };
              } else {
                basicData.push({ ...workout, numOfWorkouts: 1 });
              }
              hasAdded = true;
            }
          });

          if (!hasAdded) {
            basicData.push(empty);
          }
        });
        break;
      case DefaulTimeEnum.MONTH:
        const firstWeek = dayjs(sortedWorkouts[0].startDate).week();
        const lastWeek = dayjs(sortedWorkouts[sortedWorkouts.length - 1].startDate).week();


        labels.forEach((label, index) => {
          const labelInInt = parseInt(label);
          let hasAdded = false;
          filteredWorkouts.forEach(workout => {
            const workoutWeek = dayjs(workout.date).week();
            if (labelInInt === workoutWeek) {
              if (basicData[basicData.length - 1] && labelInInt === dayjs(basicData[basicData.length - 1].date).week()) {
                basicData[basicData.length - 1] = {
                  ...basicData[basicData.length - 1],
                  cardio: basicData[basicData.length - 1].cardio + workout.cardio,
                  weight: basicData[basicData.length - 1].weight + workout.weight,
                  duration: basicData[basicData.length - 1].duration + workout.duration,
                  numOfWorkouts: basicData[basicData.length - 1].numOfWorkouts! + 1
                };
              } else {
                basicData.push({ ...workout, numOfWorkouts: 1 });
              }
              hasAdded = true;
            }
          });
          !hasAdded && basicData.push(empty);
        });

        labels = labels.map((newLabel, index) => `Week ${index + 1}`)
        break;
      default:
        labels.unshift(labels[labels.length - 1]);
        labels.pop();

        labels.forEach((label, index) => {
          let hasAdded = false;
          filteredWorkouts.forEach(workout => {
            if (label === dayjs(workout.date).format("dddd")) {
              if (basicData[basicData.length - 1] && index === dayjs(basicData[basicData.length - 1].date).get('day')) {
                basicData[basicData.length - 1] = {
                  ...basicData[basicData.length - 1],
                  cardio: basicData[basicData.length - 1].cardio + workout.cardio,
                  weight: basicData[basicData.length - 1].weight + workout.weight,
                  duration: basicData[basicData.length - 1].duration + workout.duration,
                  numOfWorkouts: basicData[basicData.length - 1].numOfWorkouts! + 1
                };
              } else {
                basicData.push({ ...workout, numOfWorkouts: 1 });
              }
              hasAdded = true;
            }
          });

          !hasAdded && basicData.push(empty);
        });
        
        labels.push(labels[0]);
        labels.shift();
        basicData.push(basicData[0]);
        basicData.shift();
        break;
    }
  }

  return {
    labels,
    data: basicData
  };
};

const filterWorkoutTiming = (workouts: IStatWorkout[], time: DefaulTimeEnum): IWorkoutTime[] => {
  let tmpData: string;
  let tmpTime: number = 0;
  let tmpCardio: number = 0;
  let tmpWeight: number = 0;
  let filteredWorkouts: IWorkoutTime[] = [];

  if (workouts.length <= 0) { return []; };

  workouts.forEach((workout, index) => {
    let exerciseReps = 0;
    let exerciseWeight = 0;

    workout.workout.forEach(exercise => {
      let exerciseReps = 0;
      let exerciseWeight = 0;
      exercise.series.forEach(serie => {
        if (exercise.itemType === ExerciseType.EXERCISE_TYPE) {
          exerciseReps = exerciseReps + serie.completedReps;
          exerciseWeight = exerciseWeight + serie.completedWeight * serie.completedReps;
        } else if (exercise.itemType === ExerciseType.CARDIO_TYPE) {
          tmpCardio = tmpCardio + serie.completedTime!;
        }
      });

      tmpWeight = exerciseWeight / exerciseReps;

    });
    tmpTime = tmpTime + workout.duration;
    tmpData = dayjs(workout.startDate).format(formatDataToCompare(time));
    if (workouts[index + 1] && dayjs(workouts[index + 1].startDate).format(formatDataToCompare(time)) !== tmpData) {
      filteredWorkouts.push({ date: workout.startDate, duration: tmpTime, weight: tmpWeight, cardio: tmpCardio });
      tmpTime = 0;
      tmpCardio = 0;
      tmpWeight = 0;
    }

    filteredWorkouts.push({ date: workout.startDate, duration: tmpTime, weight: tmpWeight, cardio: tmpCardio });
  });

  return filteredWorkouts;
};

const formatDataToCompare = (time: DefaulTimeEnum): string => {
  switch (time) {
    case DefaulTimeEnum.MORE: return 'YY';
    case DefaulTimeEnum.YEAR: return 'YY';
    case DefaulTimeEnum.MONTH: return 'YY-MM';
    case DefaulTimeEnum.WEEK: return 'YY-MM-DD';
  }
};

// Get reps vs Cardio vs rest time
export const getCardioWeightRestTimeInPeriod = (workoutList: IStatWorkout[]): IDataToChart => {
  const sortedWorkouts = workoutList.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? 1 : 0));
  
  const labels = ["Cardio Time", "Rest Time", "Weigthlifting Time"];
  const filteredWorkouts = filterWorkoutCardioRepsRestTime(sortedWorkouts);

  return {
    labels,
    data: filteredWorkouts
  };
};

const filterWorkoutCardioRepsRestTime = (workouts: IStatWorkout[]): number[] => {
  let cardioTime: number = 0;
  let restTime: number = 0;
  let duration: number = 0;
  let weightTime: number = 0;

  workouts.forEach(workout => {
    cardioTime = cardioTime + workout.cardioTime;
    restTime = restTime + workout.restTime;
    duration = duration + workout.duration;
    
    if(workout.totalReps > 0) weightTime = duration + (cardioTime + restTime);
  });

  return [cardioTime, restTime, weightTime];
};

export const getCardioWeightExerciseNumberInPeriod = (workoutList: IStatWorkout[]): IDataToChart => {
  const sortedWorkouts = workoutList.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? 1 : 0));

  const labels = ["Cardio", "Weigthlifting"];
  const filteredWorkouts = filterWorkoutCardioWeightExercisesNumber(sortedWorkouts);

  return {
    labels,
    data: filteredWorkouts
  };
};

const filterWorkoutCardioWeightExercisesNumber = (workouts: any[]): number[] => {
  let itemTypes: ExerciseType[] = [];
  workouts.forEach(workout => {
    workout.workout.forEach((exercise: IWorkoutExercise) => itemTypes.push(exercise.itemType));
  });

  const cardioExercises = itemTypes.filter(item => item === ExerciseType.CARDIO_TYPE);
  const weightExercises = itemTypes.filter(item => item === ExerciseType.EXERCISE_TYPE);

  return [cardioExercises.length, weightExercises.length];
};

// Get BodyGroups
export const getBodyGroupsInPeriod = (workoutList: IStatWorkout[]): IDataToChart => {
  const sortedWorkouts = workoutList.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? 1 : 0));
  
  const bodyGroupProgress: bodyGroupWork[] = [];

  sortedWorkouts.forEach(workout => {
    workout.workout.forEach(exercise => {
      if (exercise.itemType === ExerciseType.EXERCISE_TYPE) {
        let weight = 0;
        let reps = 0;
        exercise.series.forEach(serie => {
          weight = weight + serie.completedWeight * serie.completedReps;
          reps = reps + serie.completedReps;
        });
        
        bodyGroupProgress.push({
          name: exercise.exercise.target.bodyGroup.name as string,
          completed: weight / reps,
          date: workout.startDate
        });
      }
    });
  });
  
  let bodyGroupsFiltered: bodyGroupWork[] = [];

  bodyGroupProgress.forEach(bodyGroup => {
    if (!bodyGroupsFiltered.some(item => item.name === bodyGroup.name)) {
      bodyGroupsFiltered.push(bodyGroup);
    } else {
      bodyGroupsFiltered.map(group => {
        group.name === bodyGroup.name && (group.completed = (group.completed + bodyGroup.completed) / bodyGroupProgress.filter(group => group.name === bodyGroup.name).length);
      });
    }
  });
  
  const dataToChart: IDataToChart = {
    labels: bodyGroupsFiltered.map(bodyGroup => bodyGroup.name),
    data: bodyGroupsFiltered.map(bodyGroup => bodyGroup.completed)
  };

  
  return dataToChart;
};

// Get Stats for exercises
// Get Most used Exercises
export const getMostUsedExercises = (workoutList: IStatWorkout[]): IFormattedExercises => {
  let cardioExercises: IStatWorkoutExercise[] = [];
  let weightExercises: IStatWorkoutExercise[] = [];
  workoutList.map(workout => {
    workout.workout.map(exercise => {
      if (exercise.itemType === ExerciseType.CARDIO_TYPE) {
        cardioExercises = [...cardioExercises, exercise];
      }
      if (exercise.itemType === ExerciseType.EXERCISE_TYPE) {
        weightExercises = [...weightExercises, exercise];
      }
    });
  });

  const cardioExercisesConverted = cardioExercises.map(exercise => {
    let time: number = 0;
    const name = exercise.exercise.name;
    const img = exercise.exercise.gifUrl;
    const series = exercise.series.length;
    exercise.series.filter((serie: ISerieCompleted) => time = time + serie.completedTime!);
    return { name, img, time, series };
  });

  const cardioExercisesSorted = cardioExercisesConverted.sort((a, b) => a.name > b.name ? 1 : -1);

  let cardioFormattedExercises: IStatCardioExercise[] = [];
  cardioExercisesSorted.map((exercise) => {
    if (!cardioFormattedExercises.some(item => item.name === exercise.name)) {
      const maxTime = exercise.time;
      const minTime = exercise.time;

      cardioFormattedExercises = [...cardioFormattedExercises, { ...exercise, maxTime, minTime }];
    } else {
      const formattedExercises = cardioFormattedExercises.map(formattedExercise => {
        if (formattedExercise.name === exercise.name) {
          const time = formattedExercise.time + exercise.time;
          const maxTime = Math.max(formattedExercise.maxTime, exercise.time);
          const minTime = Math.min(formattedExercise.minTime, exercise.time);
          const series = formattedExercise.series + exercise.series;

          return { ...formattedExercise, time, maxTime, minTime, series };
        } else {
          return formattedExercise;
        }
      });
      cardioFormattedExercises = formattedExercises;
    }
  });

  const weightExercisesConverted = weightExercises.map(exercise => {
    let reps: number = 0;
    let weight: number = 0;
    let weightForRep: number[] = [];
    exercise.series.filter((serie: ISerieCompleted) => { weight = weight + serie.completedWeight * serie.completedReps; weightForRep.push(serie.completedWeight); });
    exercise.series.filter((serie: ISerieCompleted) => reps = reps + serie.completedReps);
    const name = exercise.exercise.name;
    const img = exercise.exercise.gifUrl;
    const bodyGroup = exercise.exercise.target.bodyGroup.name;
    const series = exercise.series.length;
    const maxWeight = Math.max(...weightForRep);
    const minWeight = Math.min(...weightForRep);

    return { name, img, reps, bodyGroup, series, weight, maxWeight, minWeight };
  });

  const weightExercisesSorted = weightExercisesConverted.sort((a, b) => a.name > b.name ? 1 : -1);

  let weightFormattedExercises: IStatWeightExercise[] = [];
  weightExercisesSorted.map(exercise => {
    if (!weightFormattedExercises.some(item => item.name === exercise.name)) {
      const name = exercise.name;
      const img = exercise.img;
      const reps = exercise.reps;
      const maxWeight = exercise.maxWeight;
      const minWeight = exercise.minWeight;
      const totalWeight = exercise.weight;
      const bodyGroup = exercise.bodyGroup;
      const series = exercise.series;
      weightFormattedExercises = [...weightFormattedExercises, { name, img, reps, maxWeight, minWeight, totalWeight, bodyGroup, series }];
    } else {
      const formattedExercises = weightFormattedExercises.map(exerciseFormatted => {
        if (exerciseFormatted.name === exercise.name) {
          const reps = exerciseFormatted.reps + exercise.reps;
          const series = exerciseFormatted.series + exercise.series;
          const maxWeight = Math.max(exerciseFormatted.maxWeight, exercise.maxWeight);
          const minWeight = Math.min(exerciseFormatted.minWeight, exercise.minWeight);
          const totalWeight = exerciseFormatted.totalWeight + exercise.weight;
          return { ...exerciseFormatted, reps, maxWeight, minWeight, totalWeight, series };
        } else {
          return exerciseFormatted;
        }
      });

      weightFormattedExercises = [...formattedExercises];
    }
  });

  return {
    weightFormattedExercises,
    cardioFormattedExercises
  };
};

// Get Weight/Time progress for bodyGroup
export const getBodyGroupProgressInPeriod = (workoutList: IStatWorkout[], defaultTime?: DefaulTimeEnum, date?: date): IBodyGroupProgress => {
  const sortedWorkouts = workoutList.length > 0 ? workoutList.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? 1 : 0)) : [];

  const time = defaultTime ? defaultTime : setLabelsCustom(date?.startDate, date?.endDate).time;
  const startDate = sortedWorkouts[0]?.startDate || 0;
  let labels: string[] = defaultTime ? setTimeLabels(time, startDate) : setLabelsCustom(date?.startDate, date?.endDate).labels;

  const filteredBodyGroups = filterBodyGroupProgress(sortedWorkouts, time);

  const filteredBodyGroupsSorted = filteredBodyGroups.length > 0 ? filteredBodyGroups.sort((a, b) => (a.bodyGroup > b.bodyGroup) ? 1 : ((b.bodyGroup > a.bodyGroup) ? 1 : 0)) : [];
  // let name: string = filteredBodyGroups[0].bodyGroup;
  let bodyGroupsStacks: IBodyGroupProgressFiltered[] = [];

  let lastBodyGroup = "";
  filteredBodyGroupsSorted.forEach(group => {

    if (lastBodyGroup && lastBodyGroup === group.bodyGroup) {

      const found = bodyGroupsStacks.find(item => item.bodyGroup === lastBodyGroup);
      const replace = { ...found, data: found?.data.push(group) };
      const newStacks = bodyGroupsStacks.filter(stack => {
        stack.bodyGroup === found?.bodyGroup ? replace : stack;
      });

      bodyGroupsStacks = newStacks;
      lastBodyGroup = group.bodyGroup;
      return;
    }

    lastBodyGroup = group.bodyGroup;

    bodyGroupsStacks.push({
      bodyGroup: group.bodyGroup,
      type: group.type,
      data: [group]
    });
  });

  let basicData: IBodyGroupProgressFiltered[] = [];

  if (bodyGroupsStacks.length > 0) {
    switch (defaultTime) {
      case DefaulTimeEnum.MORE:
        labels.forEach((label, index) => {
          let hasAdded = false;
          bodyGroupsStacks.forEach(group => {
            let bodyGroupData: IBodyGroupProgressRaw[] = [];
            group.data.forEach(data => {
              if (index === dayjs(data.date).get('month')) {
                if (bodyGroupData[bodyGroupData.length - 1] && index === dayjs(bodyGroupData[bodyGroupData.length - 1].date).get('year')) {
                  bodyGroupData[bodyGroupData.length - 1] = {
                    ...bodyGroupData[bodyGroupData.length - 1],
                    cardio: bodyGroupData[bodyGroupData.length - 1].cardio as number + data.cardio! as number,
                    weight: bodyGroupData[bodyGroupData.length - 1].weight as number + data.weight! as number,
                    numOfWorkouts: bodyGroupData[bodyGroupData.length - 1].numOfWorkouts! + 1
                  };
                } else {
                  bodyGroupData.push({ ...data, numOfWorkouts: 1 });
                }
                hasAdded = true;
              }
              !hasAdded && bodyGroupData.push({ cardio: 0, weight: 0, bodyGroup: group.bodyGroup, type: group.type, date: 0 });
            });
            basicData.push({ ...group, data: bodyGroupData });
          });
        });
        break;
      case DefaulTimeEnum.YEAR:
        labels.forEach((label, index) => {
          let hasAdded = false;
          bodyGroupsStacks.forEach(group => {
            let bodyGroupData: IBodyGroupProgressRaw[] = [];
            group.data.forEach(data => {
              if (index === dayjs(data.date).get('month')) {
                if (bodyGroupData[bodyGroupData.length - 1] && index === dayjs(bodyGroupData[bodyGroupData.length - 1].date).get('month')) {
                  bodyGroupData[bodyGroupData.length - 1] = {
                    ...bodyGroupData[bodyGroupData.length - 1],
                    cardio: bodyGroupData[bodyGroupData.length - 1].cardio as number + data.cardio! as number,
                    weight: bodyGroupData[bodyGroupData.length - 1].weight as number + data.weight! as number,
                    numOfWorkouts: bodyGroupData[bodyGroupData.length - 1].numOfWorkouts! + 1
                  };
                } else {
                  bodyGroupData.push({ ...data, numOfWorkouts: 1 });
                }
                hasAdded = true;
              }
              !hasAdded && bodyGroupData.push({ cardio: 0, weight: 0, bodyGroup: group.bodyGroup, type: group.type, date: 0 });
            });
            basicData.push({ ...group, data: bodyGroupData });
          });
        });
        break;
      case DefaulTimeEnum.MONTH:
        const firstWeek = dayjs(setStartDay('month', dayjs(sortedWorkouts[0].startDate).toISOString())).week();
        const lastWeek = dayjs(setLastDay(dayjs(sortedWorkouts[0].startDate).toISOString())).week();

        labels.forEach((label, index) => {
          const labelInInt = parseInt(label);
          let hasAdded = false;
          bodyGroupsStacks.forEach(group => {
            let bodyGroupData: IBodyGroupProgressRaw[] = [];
            group.data.forEach(data => {
              const workoutWeek = dayjs(data.date).week();
              if (labelInInt === workoutWeek) {
                if (bodyGroupData[bodyGroupData.length - 1] && labelInInt === dayjs(bodyGroupData[bodyGroupData.length - 1].date).week()) {
                  bodyGroupData[bodyGroupData.length - 1] = {
                    ...bodyGroupData[bodyGroupData.length - 1],
                    cardio: bodyGroupData[bodyGroupData.length - 1].cardio as number + data.cardio! as number,
                    weight: bodyGroupData[bodyGroupData.length - 1].weight as number + data.weight! as number,
                    numOfWorkouts: bodyGroupData[bodyGroupData.length - 1].numOfWorkouts! + 1
                  };
                } else {
                  bodyGroupData.push({ ...data, numOfWorkouts: 1 });
                }
                hasAdded = true;
              }
              !hasAdded && bodyGroupData.push({ cardio: 0, weight: 0, bodyGroup: group.bodyGroup, type: group.type, date: 0 });
            });
            basicData.push({ ...group, data: bodyGroupData });
          });
        });
        labels = labels.map((newLabel, index) => `Week ${index + 1}`)
        break;
      default:
        labels.unshift(labels[labels.length - 1]);
        labels.pop();

        labels.forEach((label, index) => {
          let hasAdded = false;
          bodyGroupsStacks.forEach(group => {
            let bodyGroupData: IBodyGroupProgressRaw[] = [];
            group.data.forEach(data => {
              if (index === dayjs(data.date).get('month')) {
                if (bodyGroupData[bodyGroupData.length - 1] && index === dayjs(bodyGroupData[bodyGroupData.length - 1].date).get('month')) {
                  bodyGroupData[bodyGroupData.length - 1] = {
                    ...bodyGroupData[bodyGroupData.length - 1],
                    cardio: bodyGroupData[bodyGroupData.length - 1].cardio as number + data.cardio! as number,
                    weight: bodyGroupData[bodyGroupData.length - 1].weight as number + data.weight! as number,
                    numOfWorkouts: bodyGroupData[bodyGroupData.length - 1].numOfWorkouts! + 1
                  };
                } else {
                  bodyGroupData.push({ ...data, numOfWorkouts: 1 });
                }
                hasAdded = true;
              }
              !hasAdded && bodyGroupData.push({ cardio: 0, weight: 0, bodyGroup: group.bodyGroup, type: group.type, date: 0 });
            });
            basicData.push({ ...group, data: bodyGroupData });
          });
        });
        labels.push(labels[0]);
        labels.shift();
        basicData.push(basicData[0]);
        basicData.shift();
        break;
    }
  }

  let bodyGroupsInList: any[] = [];

  basicData.forEach(data => {
    if (!bodyGroupsInList.some(group => group.bodyGroup === data.bodyGroup)) {
      bodyGroupsInList.push({ bodyGroup: data.bodyGroup, type: data.type, data: [] });
    }
  });

  let data: any[] = [];

  for (let index = 0; index < bodyGroupsInList.length; index++) {
    const currentGroup = bodyGroupsInList[index];
    data.push(currentGroup);

    basicData.forEach(group => {
      if (group.bodyGroup === data[index].bodyGroup) {
        data[index].data.push(...group.data);
      }
    });
  }

  return { labels, data };
};

const filterBodyGroupProgress = (workouts: IStatWorkout[], time: DefaulTimeEnum): IBodyGroupProgressRaw[] => {
  let tmpData: string;
  let tmpTime: number = 0;
  let tmpCardio: number = 0;
  let tmpWeight: number = 0;
  let tpmType: ExerciseType;
  let tmpBodyGroup: string;
  let filteredWorkouts: IBodyGroupProgressRaw[] = [];

  if (workouts.length <= 0) return [];

  workouts.forEach((workout, index) => {
    let exerciseReps = 0;
    let exerciseWeight = 0;

    workout.workout.forEach(exercise => {
      let exerciseReps = 0;
      let exerciseWeight = 0;
      exercise.series.forEach(serie => {
        if (exercise.itemType === ExerciseType.EXERCISE_TYPE) {
          exerciseReps = exerciseReps + serie.completedReps;
          exerciseWeight = exerciseWeight + serie.completedWeight * serie.completedReps;
        } else if (exercise.itemType === ExerciseType.CARDIO_TYPE) {
          tmpCardio = tmpCardio + serie.completedTime!;
        }
      });

      tmpWeight = exerciseWeight / exerciseReps;
      tmpBodyGroup = exercise.exercise.target.bodyGroup.name;
      tpmType = exercise.itemType as ExerciseType;

    });
    tmpTime = tmpTime + workout.duration;
    tmpData = dayjs(workout.startDate).format(formatDataToCompare(time));
    if (workouts[index + 1] && dayjs(workouts[index + 1].startDate).format(formatDataToCompare(time)) !== tmpData) {
      filteredWorkouts.push({ date: workout.startDate, weight: tmpWeight, cardio: tmpCardio, bodyGroup: tmpBodyGroup, type: tpmType });
      tmpTime = 0;
      tmpCardio = 0;
      tmpWeight = 0;
    }

    filteredWorkouts.push({ date: workout.startDate, weight: tmpWeight, cardio: tmpCardio, bodyGroup: tmpBodyGroup, type: tpmType });
  });

  return filteredWorkouts;
};

// CompareInTime
// Get Calendar with Workouts


export const getThisPeriod = (time: DefaulTimeEnum | "custom", date?: {startDate: number, endDate: number}): string => {
  switch (time) {
    case 'custom':
      return `${dayjs(date?.startDate).format("DD MMM YYYY")} - ${dayjs(date?.endDate).format("DD MMM YYYY")}`
      break;
    case 'year':
      const year = dayjs(monday.toString()).format('YYYY');
      return year;
      break;
    case 'month':
      const month = dayjs(monday.toString()).format('MMM YYYY');
      return month;
      break;
    default:
      return `${monday.format('DD MMM')} - ${sunday.format('DD MMM')}`;
  }
};

export const formatDataToStats = (baseData: string, allData: any, dataType: DataTypeEnum): string => {
  switch (dataType) {
    case DataTypeEnum.TIME:
      if(baseData.length < 6 && allData) {
        let number = baseData;
        for (let index = baseData.length; index < 6; index++) {
          number = `0${number}`
        }
        const separated = number.match(/.{1,2}/g)

        return `${separated![0]}:${separated![1]}:${separated![2]}`
      }
      const basicSplit = baseData.split('.');
      const basicTime = parseInt(basicSplit.join(''));
      const date = new Date(basicTime);
      const locale = date.toLocaleTimeString();
      const timeArr = locale.split(":");
      
      const hours = basicTime < 0 ? timeFormat.format(parseInt(timeArr[0])) : timeFormat.format(parseInt(timeArr[0]) - 1);
      const minutes = timeArr[1];
      const seconds = timeArr[2];
      
      return `${hours}:${minutes}:${seconds}`;
      break;
    case DataTypeEnum.PERCENTAGE:
      const totalPercentage = allData.dataset.data.reduce((a: number, b: number) => a + b, 0)
      
      return `${Math.round(allData.raw * 100 / totalPercentage)}%`;
      break;
    default:
      return baseData;
  }
};

export const formatLabelToStats = (baseLabel: string, labels: string[]): string => {
  let label = capitalize(baseLabel);
  labels.forEach(newLabel => {
    if (newLabel.slice(0, 3) === baseLabel) {
      label = newLabel
    }
  });
  
  return label;
};

export const formatTimeToTime = (data: number[]): number[] => {

  const response = data.map(number => {
    if(number !== 0) {
      const date = new Date(number);
      const locale = date.toLocaleTimeString();
      const result = parseInt(locale.split(':').join(''))
      let formatted = result;
      if(number.toString().length < 6) {
        const shortLocal = locale.split(':');
        formatted = parseInt(`${shortLocal[1]}${shortLocal[2]}`)
      }
      return formatted <= 5 ? 0 : formatted - 5;
    } 
    return number;
  })

  return response;
}

export const formatYAxisToStats = (baseLabel: number, dataType: DataTypeEnum): string => {
  return formatDataToStats(baseLabel.toString(), null, dataType);
};

export const setStartDay = (time: 'week' | 'month' | 'year', baseDate: string): number => {
  const splitMainDate = baseDate.split("T");
  const partialDate = splitMainDate[0].split("-");
  switch (time) {
    case 'year':
      return dayjs(`${partialDate[0]}-01-01T00:00:00`).toDate().getTime();
    case 'month':
      return dayjs(`${partialDate[0]}-${partialDate[1]}-01T00:00:00`).toDate().getTime();
    default:
      return dayjs(`${partialDate[0]}-${partialDate[1]}-${partialDate[2]}T00:00:00`).toDate().getTime();
  }
};

export const setLastDay = (baseDate: string, isCustom = false): number => {
  const splitMainDate = baseDate.split("T");
  const partialDate = splitMainDate[0].split("-");
  const daysInMonth = dayjs(baseDate).daysInMonth();
  switch (isCustom) {
    case true:
      return dayjs(`${partialDate[0]}-${partialDate[1]}-${partialDate[2]}T23:59:59`).toDate().getTime();
    default:
      return dayjs(`${partialDate[0]}-${partialDate[1]}-${daysInMonth}T23:59:59`).toDate().getTime();
  }
};

const setTimeLabels = (time: DefaulTimeEnum | 'custom', baseDate?: number, endBaseDate?: number): string[] => {
  const monthLabels: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  switch (time) {
    case 'year':
      return monthLabels;
    case 'month':
      const date = dayjs(baseDate!).toISOString();
      const firstWeek = dayjs(setStartDay('month', date)).week();
      const lastWeek = dayjs(setLastDay(date)).week();
      const weeks = [];
      for (let index = firstWeek; index <= lastWeek; index++) {
        weeks.push(index.toString());
      }

      return weeks;
    default:
      return dayLabels;

  }
  // Si el periodo es de más de dos semanas = Vista por semanas
  // El periodo es de más de 3 meses, pasamos a vista por meses
  // Si el periodo es de más de un año, pasamos a vista años
};

export const setLabelsCustom = (baseDate?: number, endBaseDate?: number): {time: DefaulTimeEnum, labels: string[]} => {
  
  const monthLabels: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayLabels: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const startDate = dayjs(baseDate!);
  const endDate = dayjs(endBaseDate!);
  const difference = endDate.diff(startDate, 'days');

  if (difference <= 14) {
    let weekDays: string[] = [];
    for (let index = 0; index <= difference; index++) {
      dayLabels.forEach(day => weekDays.push(day));
    }

    const firstDayIndex = weekDays.findIndex((day) => day === startDate.format("dddd"));
    const labels = weekDays.slice(firstDayIndex, difference+firstDayIndex+1);

    return {time: DefaulTimeEnum.WEEK, labels };
  }
  if (difference > 14 && difference <= 120) {
    const firstWeek = dayjs(baseDate!).week();
    const lastWeek = dayjs(endBaseDate!).week();
    const rest = lastWeek - firstWeek;
    const difference = rest < 0 ? lastWeek - 1 : rest;
    
    const weeks = [];
    for (let index = firstWeek; index <= lastWeek; index++) {
      weeks.push(index.toString());
    }
    
    return {time: DefaulTimeEnum.MONTH, labels: weeks};
  }
  if (difference > 120 && difference <= 730) {
    const firstDate = dayjs(setStartDay('month', dayjs(baseDate!).toISOString()));
    const lastDate = dayjs(setLastDay(dayjs(endBaseDate!).toISOString()));

    const firstYear = firstDate.year();
    const lastYear = lastDate.year();
    const firstMonth = firstDate.month();
    const lastMonth = lastDate.month();

    const firstYearMonths = monthLabels.slice(firstMonth, monthLabels.length);
    const firstYearComplete: string[] = firstYearMonths.map(month => `${month} - ${firstYear.toString()}`);

    const lastYearMonths = monthLabels.slice(0, lastMonth+1);
    const lastYearComplete: string[] = lastYearMonths.map(month => `${month} - ${lastYear.toString()}`);

    const years: string[] = [];
    for (let index = firstYear; index <= lastYear; index++) {
      years.push(index.toString());
    }
    const middleYearsComplete: string[] = [];
    years.map(year => {
      monthLabels.forEach(month => {
        middleYearsComplete.push(`${month} - ${year}`);
      });
    });

    const labels = firstYearComplete.concat(middleYearsComplete).concat(lastYearComplete)

    return {time: DefaulTimeEnum.YEAR, labels };
  }
  if (difference > 730) {
    const yearOne = dayjs(setStartDay('week', dayjs(baseDate!).toISOString())).year();
    const yearEnd = dayjs(setLastDay(dayjs(endBaseDate!).toISOString())).year();
    const years = [];
    for (let index = yearOne; index <= yearEnd; index++) {
      years.push(index.toString());
    }
    return {time: DefaulTimeEnum.MORE, labels: years};
  }
  return {time: DefaulTimeEnum.MONTH, labels: []}
};

