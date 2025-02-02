import {createStylesheet} from "../helper/styles";

export const useAppStyles = createStylesheet((theme) => ({
    root: {
        display: 'flex',
    },
    expanded: {
        flex: 1,
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    box: {
        // minHeight: 200,
        overflow: 'auto',
        // display: "flex",
        // alignItems: "flex-start",
        // flexDirection: 'column',
        // overflow: 'hidden',
        // overflowY: 'auto',
        maxWidth: 800,
        overscrollBehavior: "contain",
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxExpanded: {
        display: 'flex',
        flexDirection: 'column',
        flex: 100,
        overflow: 'hidden',
        // maxWidth: 1400,
        // padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxSmall: {
        maxWidth: 800,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxForTable: {
        maxWidth: 800,
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    small: {
        fontSize: 12,
        color: theme.textNoteColor,
    },
}));
