import config from '../config';

// Layouts

// Pages
import CV from '../pages/filePrivate/CV/CV';
import Login from '../pages/filePublic/Login/Login';
import RegisterLogin from '../pages/filePublic/RegisterLogin/RegisterLogin';
import RegisterInform from '~/pages/filePrivate/editInformation/editInformation';
import RegisInformationCV from '~/pages/filePrivate/regisInformationCV/RegisInformationCV';
import Admin from '~/pagesAdmin/Admin';
import Forget from '~/pages/filePublic/forget/forget';
import ResetPassword from '~/pages/filePublic/forget/resetPassword/resetPassword';
import ChooseCV from '~/pages/filePrivate/chooseCV/ChooseCV';
import RegisInformationUser from '~/pages/filePrivate/regisInformationUser/regisInformationUser';
import EditCVInformation from '~/pages/filePrivate/editCV/editInformationCV';
import Trash from '~/pages/pagesComponent/Trash/Trash';
import MyProfilePage from '~/pages/filePrivate/myProfilePage/MyProfilePage';

// Public routes
const publicRoutes = [
    { path: config.routes.Login, component: Login, layout: null },
    { path: config.routes.Register, component: RegisterLogin, layout: null },
    { path: config.routes.Forget, component: Forget, layout: null },
    { path: config.routes.RegisterInform, component: RegisterInform, layout: null },
    { path: config.routes.RegisInformationCV, component: RegisInformationCV, layout: null },
    { path: config.routes.ResetPassword, component: ResetPassword, layout: null },
    // { path: config.routes.upload, component: Upload, layout: HeaderOnly },
    // { path: config.routes.search, component: Search, layout: null },
];

const privateRoutes = [
    // { path: config.routes.ChooseCV, component: ChooseCV, layout: null },
    { path: config.routes.MyProfilePage, component: MyProfilePage, layout: null },
    { path: config.routes.RegisInformationUser, component: RegisInformationUser, layout: null },
    { path: config.routes.editCV, component: EditCVInformation, layout: null },
    { path: config.routes.Admin, component: Admin, layout: null },
    { path: config.routes.cv, component: CV },
    { path: config.routes.trash, component: Trash },
   
    // { path: config.routes.cvDetail, component: CV },
];

export { publicRoutes, privateRoutes };
