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

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import MenuDropdownDialog from './MenuDropdownDialog';
import { panelsSelectors, panesSelectors, explorerSelectors, projectSelectors } from '../../../selectors';
import { panelsActions, panesActions, explorerActions, modalActions, projectsActions } from '../../../actions';
import { ProjectItemTypes } from '../../../models';

const mapStateToProps = (state: any) => ({
    showTransactionsHistory: panelsSelectors.getShowTransactionsHistory(state),
    showFileSystem: panelsSelectors.getShowFileSystem(state),
    showPreview: panelsSelectors.getShowPreview(state),
    showConsole: panelsSelectors.getShowConsole(state),
    activePaneId: panesSelectors.getActivePaneId(state),
    panes: panesSelectors.getPanes(state),
    rootFolderId: explorerSelectors.getRootFolderId(state),
    project: projectSelectors.getProject(state),
});

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        togglePanel: (panel: any) => {
            dispatch(panelsActions.togglePanel(panel));
        },
        closeAllPanels: () => {
            dispatch(panelsActions.closeAllPanels());
        },
        onCreateItem: (parentId: string, type: ProjectItemTypes, name: string) => {
            dispatch(explorerActions.createItem(parentId, type, name));
        },
        closeAllPanes() {
            dispatch(panesActions.closeAllPanes());
        },
        closePane(fileId: string) {
            dispatch(panesActions.closePane(fileId));
        },
        onSaveFile(fileId: string, code: string) {
            dispatch(panesActions.saveFile(fileId, code));
        },
        showModal: (modalType: string, modalProps: any) => {
            dispatch(modalActions.showModal(modalType, modalProps));
        },
        exportProject: () => {
            dispatch(projectsActions.exportProject());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuDropdownDialog);
