import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DCM = ({ name, drinks }: { name: string; drinks: Array<any> }) => {
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      $(".cs-caret").css("visibility", "visible");
    }, 1000);
  }, []);

  return (
    <div style={{ marginTop: "10px" }}>
      <div className='menu-title'>
        <img src='/assets/leafdivider.png' className='leaf' alt='leaf' />
        {name}
      </div>

      <div
        className='menu-divider'
        style={{ backgroundColor: "rgb(109, 214, 49)" }}
      />

      <div className='container-sectionmenu cs-containermenu'>
        {drinks.map((t) => (
          <div className='cs-o'>
            <div
              className='cs-half'
              onClick={() => {
                nav(`/catering/${t.id}`);
              }}
            >
              <div className='cs-inner'>
                <div
                  className='img-menucontainer'
                  style={{ border: "2px solid rgb(109, 214, 49)" }}
                >
                  <div
                    style={{
                      backgroundImage: `url(data:image/jpeg;base64,${t.img})`,
                    }}
                    className='img-menu cs-dri'
                  />
                </div>
                <div className='menu-txtcontainer'>
                  <div className='name-menu cs-m'>{t.name}</div>
                  <div className='cs-cz cs-m'>Customize</div>
                </div>

                <div className='mitem-caret cs-caret' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DCM;
