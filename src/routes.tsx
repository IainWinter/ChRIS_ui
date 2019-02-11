
import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'

// Add view routes here
import { Dashboard } from './pages/Dashboard/Dashboard';
import  MyFeedsPage  from './pages/Feeds/MyFeeds';
import  {LogIn}  from './pages/LogIn/Login';
import  {NotFound}  from './pages/NotFound/NotFound';


const Routes: React.FunctionComponent = () => (
  <BrowserRouter>
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/my-feeds" component={MyFeedsPage} />
        <Route exact path="/login" component={LogIn} />
        
        {/* ADD MORE ROUTES HERE: <Route  path="/route" component={RouteComponent} /> */}
        {/* 404 Page Not found  */}
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
)


export default Routes;
