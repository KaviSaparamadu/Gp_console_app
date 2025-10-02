import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 0,
    marginTop: -10,
    borderRadius: 2,
    padding: 15,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#535252ff",
    marginBottom: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#eaf8eaff",
    borderRadius: 100,
    overflow: "hidden",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    width: 80,
    alignItems: "center",
    marginVertical: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#eaf8eaff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  iconImage: {
    width: 60,
    height: 60,
  },
  itemLabel: {
    fontSize: 13,
    textAlign: "center",
    color: "#4a4a4a",
    fontWeight: "600",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
});

export default styles;
