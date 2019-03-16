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

import React from 'react';
import { SubMenu, MenuItem, Divider } from '../../common/menu';
import { Panels, IPane } from '../../../models/state';
import style from './style.less';
import { ProjectItemTypes, IProject } from '../../../models';

interface IProps {
    showTransactionsHistory: boolean;
    showFileSystem: boolean;
    showPreview: boolean;
    showConsole: boolean;
    activePaneId: string;
    panes: IPane[];
    rootFolderId: string;
    project: IProject;
    togglePanel: (panel: any) => void;
    closeAllPanels: () => void;
    closeAllPanes: () => void;
    closePane: (fileId: string) => void;
    onCreateItem: (parentId: string, type: ProjectItemTypes, name: string) => void;
    onSaveFile: (fileId: string, code: string) => void;
    showModal: (modalType: string, modalProps: any) => void;
    exportProject: () => void;
}

export default class MenuDropdownDialog extends React.Component<IProps> {

    toggleFullScreen = () => {
        const document: any = window.document;
        const Element: any = document.Element;

        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    onCreateItem = (parentId: string, type: ProjectItemTypes) => {
        const name = prompt('Enter a name.');
        if (name) {
            this.props.onCreateItem(parentId, type, name);
        }
    }

    getActivePane = () => {
        return this.props.panes.find((pane: IPane) => pane.file.id === this.props.activePaneId);
    }

    handleSaveFile = () => {
        const { onSaveFile } = this.props;
        const activePane = this.getActivePane();

        if (activePane) {
            onSaveFile(activePane.file.id, activePane.unSavedCode);
        }
    }

    handleSaveAllFiles = () => {
        this.props.panes.forEach((pane) => {
            if (pane.hasUnsavedChanges) {
                this.props.onSaveFile(pane.file.id, pane.unSavedCode);
            }
        });
    }

    /**
     * @returns {Boolean} If any of the files in the project has unsaved changes
     */
    hasUnsavedChanges = () => {
        return this.props.panes.some((pane) => pane.hasUnsavedChanges);
    }

    render() {
        const { showTransactionsHistory, showFileSystem, showPreview, showConsole, showModal,
                togglePanel, closeAllPanels, closeAllPanes, closePane, rootFolderId, activePaneId, project, exportProject } = this.props;
        const activePane = this.getActivePane();
        const hasUnsavedChanges = this.hasUnsavedChanges();

        return (
            <div className={style.menuDialog}>

                <SubMenu title='File'>
                    <MenuItem title='New File' onClick={() => this.onCreateItem(rootFolderId, ProjectItemTypes.File)} />
                    <MenuItem title='New Folder' onClick={() => this.onCreateItem(rootFolderId, ProjectItemTypes.Folder)}  />
                    <Divider />
                    <MenuItem onClick={() => this.handleSaveFile()} disabled={activePane ? !activePane.hasUnsavedChanges : true} title='Save' description='Ctrl+S' />
                    <MenuItem onClick={() => this.handleSaveAllFiles()} disabled={!hasUnsavedChanges} title='Save All' />
                    <Divider />
                    <MenuItem onClick={() => closePane(activePaneId)} disabled={!activePaneId} title='Close File' />
                    <MenuItem onClick={() => closeAllPanes()} disabled={!activePaneId} title='Close All Files' />
                    <Divider />
                    <MenuItem onClick={() => showModal('EDIT_MODAL', {project})} title='Configure Project' />
                    <MenuItem onClick={() => exportProject()} title='Export Project' />
                    <MenuItem onClick={() => console.log('TODO')} title='Download Project' />
                </SubMenu>
                <SubMenu title='View'>
                    <MenuItem onClick={() => togglePanel(Panels.Explorer)} isActive={showFileSystem} title='Explorer' />
                    <MenuItem onClick={() => togglePanel(Panels.Transactions)} isActive={showTransactionsHistory} title='Transactions' />
                    <MenuItem onClick={() => togglePanel(Panels.Preview)} isActive={showPreview} title='Preview' />
                    <MenuItem onClick={() => togglePanel(Panels.CompilerOutput)} isActive={showConsole} title='Console output' />
                    <MenuItem onClick={() => closeAllPanels()} title='Close All Panels' />
                    <Divider />
                    <MenuItem onClick={() => this.toggleFullScreen()} title='Toggle Full Screen' />
                </SubMenu>
            </div>
        );
    }
}
