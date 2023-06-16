import './style.css';

import { ROUTES } from './constants/routes';
import { ROUTE_GROUPS } from './constants/route-groups';

const routesWrapper = document.getElementById('routes');
Object.values(ROUTE_GROUPS).forEach((group) => {
    const groupDiv = document.createElement('div');
    const title = document.createElement('h2');
    const groupChildsDiv = document.createElement('div');
    title.textContent = group.text;

    groupChildsDiv.classList.add('child-routes');
    groupDiv.appendChild(title);
    groupDiv.appendChild(groupChildsDiv);
    groupDiv.classList.add('group-container');
    groupDiv.classList.add(group.container);
    groupDiv.id = group.container;

    routesWrapper.appendChild(groupDiv);
});

ROUTES.forEach((route) => {
    const a = document.createElement('a');
    a.text = route.displayName;
    a.href = `./${route.name}.html${route.debug ? '#debug' : ''}`;
    const parent = document.getElementById(route.group.container);
    const childRoutesDiv = parent.getElementsByClassName('child-routes')[0];
    childRoutesDiv.appendChild(a);
});
