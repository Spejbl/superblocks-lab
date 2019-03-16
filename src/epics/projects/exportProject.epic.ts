// Copyright 2019 Superblocks AB
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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import moment from 'moment';
import { traverseTree } from '../../reducers/explorerLib';
import { ProjectItemTypes } from '../../models';

export const exportProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.EXPORT_PROJECT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
        const project = state.projects.project;
        const exportName =  `superblocks_${project.name.replace(' ', '_')}-${moment.utc(project.lastModifiedAt).unix()}.zip`;
        const zip = new JSZip();

        // Traverse all files in explorer and add them to the zip file
        traverseTree(state.explorer.tree, (item, path) => {
            const pathString = path().join('/');
            if (item.type === ProjectItemTypes.File) {
                zip.file(pathString, item.code ? item.code : '');
            }
        });
        
        // Show download of zip file
        zip.generateAsync({type: 'blob'})
        .then((blob) => {
            FileSaver.saveAs(blob, exportName);
        });

        return of(projectsActions.exportProjectSuccess);
    }),
    catchError((error) => {
        console.log('There was an issue exporting the project: ' + error);
        return of(projectsActions.exportProjectFail(error.message));
    })
);
