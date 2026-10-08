/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replace } from '../../../lib/redux-router';

import selectors from '../../../selectors';
import { HomeViews, UserRoles } from '../../../constants/Enums';
import Paths from '../../../constants/Paths';
import GridProjectsView from './GridProjectsView';
import GroupedProjectsView from './GroupedProjectsView';

import styles from './Home.module.scss';

const Home = React.memo(() => {
  const view = useSelector(selectors.selectHomeView);
  const boardIds = useSelector(selectors.selectVisibleBoardIdsForCurrentUser);
  const currentUser = useSelector(selectors.selectCurrentUser);
  const dispatch = useDispatch();

  const onlyBoardId =
    boardIds.length === 1 && currentUser.role !== UserRoles.ADMIN ? boardIds[0] : null;

  useEffect(() => {
    if (onlyBoardId) {
      dispatch(replace(Paths.BOARDS.replace(':id', onlyBoardId)));
    }
  }, [dispatch, onlyBoardId]);

  if (onlyBoardId) {
    return null;
  }

  let View;
  switch (view) {
    case HomeViews.GRID_PROJECTS:
      View = GridProjectsView;

      break;
    case HomeViews.GROUPED_PROJECTS:
      View = GroupedProjectsView;

      break;
    default:
  }

  return (
    <div className={styles.wrapper}>
      <View />
    </div>
  );
});

export default Home;
