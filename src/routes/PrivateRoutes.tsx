import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const  PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
    exact: boolean;
}> = (props) => {

const condition = useSelector((state:any) => state.user.user)

return  condition ? (<Route  path={props.path}  exact={props.exact} component={props.component} />) : 
    (<Redirect  to="/login"  />);
};
export  default  PrivateRoute;