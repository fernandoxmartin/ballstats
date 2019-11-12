let input = document.querySelector(".search");

document
  .querySelector("form.search-form")
  .addEventListener("submit", function(e) {
    e.preventDefault();
    let player = input.value;
    player = player.replace(/\s+/g, "+");
    document.querySelector(".search-form").reset();

    const player_searched = `https://www.balldontlie.io/api/v1/players?search=${player}`;

    fetch(player_searched)
      .then(resp => resp.json())
      .then(function(data) {
        if (data.data[0] === undefined) {
          console.log("error");
          const error = document.querySelector(".error");
          error.style.opacity = "100";
          error.innerHTML = "Player Not Found";
          setTimeout(function() {
            let sec = 5;
            error.style.opacity = "0";
          }, 5 * 1000);
        } else {
          addPlayer();
          let playerName =
            data.data[0].first_name + " " + data.data[0].last_name;
          let playerPos = data.data[0].position;
          let playerTeam = data.data[0].team.abbreviation;
          let nameContainer = document.querySelectorAll(".name");
          let positionContainer = document.querySelectorAll(".position");
          let index = nameContainer.length - 1;
          nameContainer[index].textContent += playerName;
          positionContainer[index].textContent +=
            playerTeam + " | " + playerPos;
          let player_id = data.data[0].id;
          getStats(player_id);
        }
      })
      .catch(err => console.error(err));

    function addPlayer() {
      let player_container = document.createElement("DIV");
      player_container.innerHTML = `
        <div class="left">
            <div class="left-inner">
                <div class="info">
                    <h1 class="name"></h1>
                    <h3 class="position"></h3>
                </div>
                <div class="stat_container">
                    <ul class="stat_headers list">
                        <li>PTS</li>
                        <li>FG%</li>
                        <li>3PT%</li>
                        <li>FT%</li>
                        <li>REB</li>
                        <li>AST</li>
                        <li>STL</li>
                        <li>BLK</li>
                    </ul>
                    <ul class="stats list">
                        <li class="pts"></li>
                        <li class="fg"></li>
                        <li class="fg3"></li>
                        <li class="ft"></li>
                        <li class="reb"></li>
                        <li class="ast"></li>
                        <li class="stl"></li>
                        <li class="blk"></li>
                    </ul>
                </div>  
               <div class="remove">
                <button class="remove-button fas fa-times-circle"></button>
               </div>   
            </div>
            
        </div>`;
      document.querySelector(".players-list").appendChild(player_container);

      const player_containers = document.querySelectorAll(".left");
      let i = player_containers.length - 1;
      const removeButton = document.querySelectorAll(".remove");
      removeButton[i].addEventListener("click", () => {
        player_containers[i].remove();
      });
    }

    function getStats(player_id) {
      let player_stats = `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${player_id}`;
      fetch(player_stats)
        .then(resp => resp.json())
        .then(function(data) {
          let stat = {
            pts: data.data[0].pts.toFixed(1),
            fg: (data.data[0].fg_pct * 100).toFixed(1),
            fg3: (data.data[0].fg3_pct * 100).toFixed(1),
            ft: (data.data[0].ft_pct * 100).toFixed(1),
            reb: data.data[0].reb.toFixed(1),
            ast: data.data[0].ast.toFixed(1),
            stl: data.data[0].stl.toFixed(1),
            blk: data.data[0].blk.toFixed(1)
          };

          console.log(stat.fg);
          let ptContainer = document.querySelectorAll(".pts");
          let fgContainer = document.querySelectorAll(".fg");
          let fg3Container = document.querySelectorAll(".fg3");
          let ftContainer = document.querySelectorAll(".ft");
          let rebContainer = document.querySelectorAll(".reb");
          let astContainer = document.querySelectorAll(".ast");
          let stlContainer = document.querySelectorAll(".stl");
          let blkContainer = document.querySelectorAll(".blk");
          let index = ptContainer.length - 1;

          ptContainer[index].textContent += stat.pts;
          fgContainer[index].textContent += stat.fg;
          fg3Container[index].textContent += stat.fg3;
          ftContainer[index].textContent += stat.ft;
          rebContainer[index].textContent += stat.reb;
          astContainer[index].textContent += stat.ast;
          stlContainer[index].textContent += stat.stl;
          blkContainer[index].textContent += stat.blk;
        })
        .catch(err => console.error(err));
    }
  });
