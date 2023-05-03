import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import { db, IGetWorkoutsEndpointOut, IPostWorkoutEndpointIn, IPostWorkoutEndpointOut, Workout } from '..';
import { DefaulTimeEnum, IStatWorkout } from '../../interfaces/stats';
import { statsConverter } from '../../utils';
import { validateJWT } from '../../utils/jwt';
import { getCalendarWorkout } from '../../utils/stats-converter';

export type Data =
| { message: any }
| IPostWorkoutEndpointOut

export const getStats = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<any | { message: string }> => {
  const {startDate, endDate, defaultTime} = req.body;
  
  let startDateFind = startDate;
  let endDateFind = endDate;
  
  let time = defaultTime;
  
  if(defaultTime && defaultTime !== "custom") {
    dayjs.extend(weekday);
    startDateFind = statsConverter.setStartDay(defaultTime, dayjs().weekday(1).toISOString());
    endDateFind = endDateFind === 0 ? Date.now() : undefined;
  } else {
    time = null;
    endDateFind = !endDate && Date.now();
  }

  try {
    await db.connect();
    const { id } = await validateJWT(req, res);
    const workouts: IStatWorkout[] = await Workout.find({
      startDate: {
        $gte: startDateFind,
        $lte: endDateFind || Date.now(),
      },
      createdBy: id
    })
    .populate({
      path: 'routine',
      populate: {
        path: 'bodyGroups',
        select: 'name'
      }
    })
    .populate({
      path: 'workout',
      populate: {
        path: 'exercise',
        populate: {
          path: 'target',
          select: 'bodyGroup',
          populate: {
            path: 'bodyGroup',
            select: 'name'
          }
        }
      }
    })
    .lean();

    const date = {startDate: startDateFind, endDate: endDateFind || Date.now()};

    const progressInTime = statsConverter.getProgressInPeriod(workouts, time, date);
    const cardioWeightRestRelation = statsConverter.getCardioWeightRestTimeInPeriod(workouts);
    const cardioWeigthExercisesNumber = statsConverter.getCardioWeightExerciseNumberInPeriod(workouts);
    const bodyGroupsRelation = statsConverter.getBodyGroupsInPeriod(workouts);
    const mostUsedExercises = statsConverter.getMostUsedExercises(workouts);
    const bodyGroupsProgression = statsConverter.getBodyGroupProgressInPeriod(workouts, defaultTime)

    const response = {progressInTime, cardioWeightRestRelation, cardioWeigthExercisesNumber, bodyGroupsRelation, bodyGroupsProgression, mostUsedExercises, workouts}
    
    await db.disconnect();
    
    res.status(200).json({message: "Stats getted", response});
    return {message: "Stats getted"};

  } catch (error) {
    res.status(500).json({ message: "Error getting the workouts" });
    return { message: "Error getting the workouts" };
  }
};

export const getCalendarWorkoutList = async (req: NextApiRequest, res: NextApiResponse<any>): Promise<any | { message: string }> => {
  try {
    await db.connect();
    const { id } = await validateJWT(req, res);
    const response: IStatWorkout[] = await Workout.find({
      createdBy: id
    })
    .populate({
      path: 'routine',
      populate: {
        path: 'bodyGroups',
        select: 'name'
      }
    })
    .populate({
      path: 'workout',
      populate: {
        path: 'exercise',
        populate: {
          path: 'target',
          select: 'bodyGroup',
          populate: {
            path: 'bodyGroup',
            select: 'name'
          }
        }
      }
    })
    .lean();

    const workoutCalendar = getCalendarWorkout(response);

    await db.disconnect();
    res.status(200).json({message: "Stats getted", workoutCalendar});
    return {message: "Stats getted"};
  } catch (error) {
    res.status(500).json({ message: "Error getting the workouts" });
    return { message: "Error getting the workouts" };
  }
 
}