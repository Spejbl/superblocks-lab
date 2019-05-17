// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import style from './style.less';
import classNames from 'classnames';

interface IProps {
    title: string | JSX.Element;
    icon?: JSX.Element | JSX.Element[];
    className?: string;
    visibleCollapsed?: boolean;
}

export function SideMenuHeader(props: IProps) {
    return (
        <div className={classNames([style.sideMenuHeader, props.className, props.visibleCollapsed ? style.visibleCollapsed : null])}>
            {props.icon}
            {props.title}
        </div>
    );
}
