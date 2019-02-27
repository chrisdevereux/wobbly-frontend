import * as React from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";

import { searchGroups, searchGroups_searchGroups } from "../../generated/searchGroups";
import { SEARCH_GROUPS_QUERY } from "../../graphql/queries";
import { NavigationService } from "../../services";
import { colors } from "../../style/common";
import { createNavigatorFunction } from "../../util";
import WobblyText from "../atoms/WobblyText";
import { CreateGroupFooter, SearchBar } from "../molecules";
import { GroupsList, LoadingState } from "../organisms";

interface ISearchGroupsModalProps extends WithApolloClient<{}> {}
interface ISearchGroupsModalState {
  results?: searchGroups_searchGroups[];
  loading: boolean;
  query: string;
}

class SearchGroupsModal extends React.PureComponent<ISearchGroupsModalProps, ISearchGroupsModalState> {
  public static navigationOptions = () => {
    return {
      title: "Search",
      headerRight: <Button type="clear" title="Cancel" onPress={NavigationService.goBack} />
    };
  };

  private static navigateToCreateGroup = createNavigatorFunction("CreateGroup");

  public constructor(props: ISearchGroupsModalProps) {
    super(props);
    this.state = { loading: false, query: "" };
  }

  public render() {
    let content: JSX.Element | undefined;
    let footer: JSX.Element | undefined;
    const { loading, results } = this.state;
    if (loading) {
      content = <LoadingState />;
    } else if (results && results.length > 0) {
      // TODO: fix `as any` type hack below
      content = <GroupsList groups={results} onPressFactory={this.onPressFactory as any} />;
    } else if (results !== undefined && results.length === 0) {
      content = (
        <View style={style.noResultsWrapper}>
          <WobblyText style={style.noResultsText}>No results</WobblyText>
        </View>
      );
    }

    if (results) {
      footer = <CreateGroupFooter onButtonPress={SearchGroupsModal.navigateToCreateGroup} />;
    }

    return (
      <View style={style.container}>
        <SearchBar placeholder="Search for a group..." onSubmit={this.handleSearch} />
        {content}
        {footer}
      </View>
    );
  }

  private handleSearch = (searchQuery: string) => {
    this.setState({ loading: true });
    this.props.client
      .query<searchGroups>({
        query: SEARCH_GROUPS_QUERY,
        variables: { searchQuery }
      })
      .then(response => {
        if (!response.data.searchGroups) {
          return;
        }
        this.setState({
          results: response.data.searchGroups
            .filter(group => group && group.name && group.id)
            .map(group => ({
              __typename: "GroupSearchResponse" as "GroupSearchResponse",
              name: group!.name,
              id: group!.id,
              description: group!.description
            })),
          loading: false
        });
      });
  };

  private onPressFactory = (item: searchGroups_searchGroups): (() => void) => {
    return createNavigatorFunction("JoinGroup", { groupId: item.id, groupName: item.name });
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  noResultsWrapper: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  noResultsText: {
    color: colors.darkGray5
  }
});

export default withApollo(SearchGroupsModal);
