/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { apply, call, fork, select, take } from 'redux-saga/effects';

import watchers from './watchers';
import services from './services';
import runWatchers from '../run-watchers';
import selectors from '../../selectors';
import { socket } from '../../api';
import ActionTypes from '../../constants/ActionTypes';
import Paths from '../../constants/Paths';

export default function* coreSaga(redirectFromLogin = false) {
  yield runWatchers(watchers);

  if (redirectFromLogin) {
    yield call(services.goToRoot);
  }

  yield apply(socket, socket.connect);
  yield fork(services.initializeCore);

  yield take(ActionTypes.LOGOUT);

  const oidcConfig = yield select(selectors.selectOidcConfig);

  if (oidcConfig && oidcConfig.endSessionUrl !== null) {
    const currentUser = yield select(selectors.selectCurrentUser);

    if (!currentUser || currentUser.isSsoUser) {
      // Redirect the user to the IDP to log out.
      window.location.href = oidcConfig.endSessionUrl;
      return;
    }
  }

  window.location.href = Paths.LOGIN;
}
